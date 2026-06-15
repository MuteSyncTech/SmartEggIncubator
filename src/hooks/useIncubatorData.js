import { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    const { data: sensorData, error } = await supabase
      .from('sensor_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !sensorData?.length) {
      setData(prev => ({
        ...prev,
        isDeviceOffline: true
      }));
      return;
    }

    const latest = sensorData[0];

    const deviceOffline =
      (new Date() - new Date(latest.created_at)) > 30000;

    setData({
      temperature: latest.suhu || 0,
      humidity: latest.kelembapan || 0,
      waterLevel: !latest.air_habis,

      actuators: {
        heater: latest.heater || false,
        fan: latest.fan || false,
        pump: latest.pompa || false,
        servo: latest.servo || false
      },

      history: sensorData
        .slice()
        .reverse()
        .map(item => ({
          time: new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          temperature: item.suhu,
          humidity: item.kelembapan
        })),

      logs: sensorData,

      isDeviceOffline: deviceOffline,

      lastTurnTimestamp: new Date(latest.created_at).toLocaleString()
    });
  }

  return { data };
}