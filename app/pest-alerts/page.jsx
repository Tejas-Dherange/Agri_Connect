'use client';

import { useState } from 'react';
import PestReportForm from '@/components/pest/PestReportForm';
import PestAlertMap from '@/components/pest/PestAlertMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PestAlertsPage() {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pest Alerts & Reports</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">Pest Alert Map</TabsTrigger>
          <TabsTrigger value="report">Report Pest Outbreak</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <PestAlertMap />
          </div>
        </TabsContent>
        
        <TabsContent value="report" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Report a Pest Outbreak</h2>
            <PestReportForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 