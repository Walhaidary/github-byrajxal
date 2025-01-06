import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { ServiceReceiptReport } from '../components/reports/ServiceReceiptReport';
import { BackupReport } from '../components/backup/BackupReport';

export default function ValidateService() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Service Receipt Report</h1>
      </div>

      <Tabs defaultValue="report" className="w-full">
        <TabsList>
          <TabsTrigger value="report">Service Receipt Report</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="report">
          <ServiceReceiptReport />
        </TabsContent>

        <TabsContent value="backup">
          <BackupReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}