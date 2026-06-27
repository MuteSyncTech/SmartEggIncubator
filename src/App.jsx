import React, { useState } from 'react';
import { useIncubatorData } from './hooks/useIncubatorData';
import { DashboardLayout } from './components/DashboardLayout';
import { ProgressTracker } from './components/ProgressTracker';
import { MetricCard } from './components/MetricCard';
import { StatusCard } from './components/StatusCard';
import { ActuatorStatus } from './components/ActuatorStatus';
import { HistoryChart } from './components/HistoryChart';
import { DataLogTable } from './components/DataLogTable';

function App() {
  const { data } = useIncubatorData();
  const [activePage, setActivePage] = useState('overview');

  return (
    <DashboardLayout
      isOffline={data.isDeviceOffline}
      activePage={activePage}
      setActivePage={setActivePage}
    >
      {activePage === 'overview' && (
        <div className="space-y-5">
          <ProgressTracker data={data} />

          <div className="grid grid-cols-4 gap-5">
            <MetricCard title="Temperature" value={data.temperature} unit="°C" type="temperature" />
            <MetricCard title="Humidity" value={data.humidity} unit="%" type="humidity" />
            <StatusCard title="Water Tank" value={data.waterLevel} type="water" />
            <StatusCard title="Last Update Data" value={data.lastTurnTimestamp} type="tray" />
          </div>

          <div className="grid grid-cols-12 gap-5 mt-2 items-stretch">
            <div className="col-span-4">
              <ActuatorStatus actuators={data.actuators} />
            </div>
            <div className="col-span-8">
              <HistoryChart data={data.history} />
            </div>
          </div>
        </div>
      )}

      {activePage === 'logs' && (
        <DataLogTable />
      )}
    </DashboardLayout>
  );
}

export default App;
