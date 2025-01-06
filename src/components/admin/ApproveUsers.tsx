import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { UserRoleSelect } from './UserRoleSelect';
import { updateUserRoles } from '../../lib/users';

interface User {
  id: string;
  email: string;
  created_at: string;
  role: string;
}

interface UserUpdate {
  id: string;
  newRole: string;
}

export default function ApproveUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [roleUpdates, setRoleUpdates] = useState<UserUpdate[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, created_at, role')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      }
      return [...prev, userId];
    });
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setRoleUpdates(prev => {
      const existing = prev.find(update => update.id === userId);
      if (existing) {
        return prev.map(update => 
          update.id === userId ? { ...update, newRole } : update
        );
      }
      return [...prev, { id: userId, newRole }];
    });

    // Auto-select the user when their role is changed
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers(prev => [...prev, userId]);
    }
  };

  const handleUpdateRoles = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user to update');
      return;
    }

    const updates = selectedUsers
      .map(userId => {
        const update = roleUpdates.find(u => u.id === userId);
        const user = users.find(u => u.id === userId);
        return {
          userId,
          role: update?.newRole || user?.role || 'user'
        };
      });

    setUpdating(true);
    try {
      const { success, error } = await updateUserRoles(updates);
      
      if (!success) throw error;
      
      await fetchUsers();
      setSelectedUsers([]);
      setRoleUpdates([]);
      alert('User roles updated successfully');
    } catch (err) {
      console.error('Error updating roles:', err);
      alert('Failed to update user roles. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
          <p className="text-blue-700">
            {selectedUsers.length} user(s) selected
          </p>
          <Button
            onClick={handleUpdateRoles}
            disabled={updating}
          >
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Roles'
            )}
          </Button>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <UserRoleSelect
                      value={roleUpdates.find(u => u.id === user.id)?.newRole || user.role || 'user'}
                      onChange={(newRole) => handleRoleChange(user.id, newRole)}
                      disabled={updating}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}