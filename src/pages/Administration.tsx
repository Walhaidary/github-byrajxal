import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import ServiceProviderManagement from '../components/admin/ServiceProviderManagement';
import ServiceConfiguration from '../components/admin/ServiceConfiguration';
import { CreateUser } from '../components/admin/CreateUser';
import { AdminReceiptControl } from '../components/admin/AdminReceiptControl';

export default function Administration() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-facebook-text">Administration</h1>
      </div>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList>
          <TabsTrigger value="providers">Service Provider Management</TabsTrigger>
          <TabsTrigger value="services">Service Configuration</TabsTrigger>
          <TabsTrigger value="create-user">Create User</TabsTrigger>
          <TabsTrigger value="receipts">Admin Receipt Control</TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          <ServiceProviderManagement />
        </TabsContent>

        <TabsContent value="services">
          <ServiceConfiguration />
        </TabsContent>

        <TabsContent value="create-user">
          <CreateUser />
        </TabsContent>

        <TabsContent value="receipts">
          <AdminReceiptControl />
        </TabsContent>
      </Tabs>
    </div>
  );
}