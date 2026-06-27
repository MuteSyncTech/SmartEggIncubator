import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useIncubatorData() {
  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    waterLevel: false,
    actuators: {
      heater: false,
      fan: false,
      pump: false,
      servo: false
    },
    history: [],
    logs: [],
    isDeviceOffline: true,
    lastTurnTimestamp: "-"
  });

  const fetchData = useCallback(async () => {
  // Query untuk overview (20 terbaru)
  const { data: sensorData, error } = await supabase
    .from('sensor_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !sensorData?.length) {
    setData(prev => ({ ...prev, isDeviceOffline: true }));
    return;
  }

  // Query untuk logs (semua data hari ke-6 sampai 21)
  const { data: allLogs } = await supabase
    .from('sensor_data')
    .select('*')
    .gte('hari', 6)
    .lte('hari', 21)
    .order('created_at', { ascending: true });
    
    console.log('ALL LOGS:', allLogs?.length);

  const latest = sensorData[0];
  const deviceOffline = (new Date() - new Date(latest.created_at)) > 30000;

  setData({
    temperature: latest.suhu || 0,
    humidity: latest.kelembapan || 0,
    waterLevel: !latest.air_habis,
    actuators: {
      heater: Boolean(latest.heater),
      fan: Boolean(latest.fan),
      pump: Boolean(latest.pompa),
      servo: Boolean(latest.servo)
    },
    history: sensorData.slice().reverse().map(item => ({
      time: new Date(item.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      temperature: item.suhu,
      humidity: item.kelembapan
    })),
    logs: allLogs || [],   // <-- semua log per hari
    isDeviceOffline: deviceOffline,
    lastTurnTimestamp: new Date(latest.created_at).toLocaleString('id-ID', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  });
}, []);

  useEffect(() => {
    // Fetch pertama kali
    fetchData();

    // Polling backup tiap 5 detik
    const interval = setInterval(fetchData, 5000);

    // Realtime subscription — update langsung saat ESP32 kirim data baru
    const channel = supabase
      .channel('sensor_data_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_data'
        },
        (payload) => {
          console.log('REALTIME INSERT:', payload.new);
          fetchData();
        }
      )
      .subscribe((status) => {
        console.log('Realtime status:', status);
      });

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return { data };
}