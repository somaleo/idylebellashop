import React, { useState, memo } from 'react';
import { customers } from '../data/mockData';
import { Phone, Mail, Building, Plus, Eye, Pencil, Trash2, X } from 'lucide-react';

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
}

const initialFormData: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'active'
};

// Memoized form component
const CustomerForm = memo(({
  onSubmit,
  onCancel,
  initialData = initialFormData,
  isAdd = true
}: {
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
  initialData?: CustomerFormData;
  isAdd?: boolean;
}) => {
  const [formData, setFormData] = useState<CustomerFormData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = <K extends keyof CustomerFormData>(field: K, value: CustomerFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={e => handleChange('email', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={e => handleChange('phone', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Company</label>
        <input
          type="text"
          value={formData.company}
          onChange={e => handleChange('company', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status}
          onChange={e => handleChange('status', e.target.value as CustomerFormData['status'])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {isAdd ? 'Add Customer' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
});

CustomerForm.displayName = 'CustomerForm';

// Memoized customer row component
const CustomerRow = memo(({
  customer,
  onView,
  onEdit,
  onDelete
}: {
  customer: typeof customers[0];
  onView: (customer: typeof customers[0]) => void;
  onEdit: (customer: typeof customers[0]) => void;
  onDelete: (customer: typeof customers[0]) => void;
}) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4">
      <div className="font-medium">{customer.name}</div>
    </td>
    <td className="px-6 py-4">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center text-sm text-gray-600">
          <Mail size={16} className="mr-2 text-gray-400" />
          {customer.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone size={16} className="mr-2 text-gray-400" />
          {customer.phone}
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center text-sm">
        <Building size={16} className="mr-2 text-gray-400" />
        {customer.company}
      </div>
    </td>
    <td className="px-6 py-4">
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
        customer.status === 'active'
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {customer.status}
      </span>
    </td>
    <td className="px-6 py-4 text-sm text-gray-600">
      {customer.lastContact}
    </td>
    <td className="px-6 py-4 text-right space-x-2">
      <button 
        onClick={() => onView(customer)}
        className="btn-icon text-blue-600 hover:bg-blue-50" 
        title="View"
      >
        <Eye size={18} />
      </button>
      <button 
        onClick={() => onEdit(customer)}
        className="btn-icon text-amber-600 hover:bg-amber-50" 
        title="Edit"
      >
        <Pencil size={18} />
      </button>
      <button 
        onClick={() => onDelete(customer)}
        className="btn-icon text-red-600 hover:bg-red-50" 
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </td>
  </tr>
));

CustomerRow.displayName = 'CustomerRow';

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleAdd = () => {
    setIsAddOpen(true);
  };

  const handleView = (customer: typeof customers[0]) => {
    setSelectedCustomer(customer);
    setIsViewOpen(true);
  };

  const handleEdit = (customer: typeof customers[0]) => {
    setSelectedCustomer(customer);
    setIsEditOpen(true);
  };

  const handleDelete = (customer: typeof customers[0]) => {
    setSelectedCustomer(customer);
    setIsDeleteConfirmOpen(true);
  };

  const handleSubmit = (formData: CustomerFormData) => {
    if (isAddOpen) {
      console.log('Adding new customer:', formData);
      setIsAddOpen(false);
    } else if (isEditOpen && selectedCustomer) {
      console.log('Updating customer:', selectedCustomer.id, formData);
      setIsEditOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedCustomer) {
      console.log('Deleting customer:', selectedCustomer.id);
      setIsDeleteConfirmOpen(false);
      setSelectedCustomer(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
        <button 
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Contact
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {isViewOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customer Details</h2>
              <button
                onClick={() => setIsViewOpen(false)}
                className="btn-icon text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{selectedCustomer.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{selectedCustomer.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{selectedCustomer.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Company</label>
                <p className="text-gray-900">{selectedCustomer.company}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-gray-900">{selectedCustomer.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Contact</label>
                <p className="text-gray-900">{selectedCustomer.lastContact}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isAddOpen ? 'Add Customer' : 'Edit Customer'}
              </h2>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setIsEditOpen(false);
                }}
                className="btn-icon text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <CustomerForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsAddOpen(false);
                setIsEditOpen(false);
              }}
              initialData={selectedCustomer || initialFormData}
              isAdd={isAddOpen}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Confirm Delete</h2>
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="btn-icon text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedCustomer.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;