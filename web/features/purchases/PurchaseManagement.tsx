'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useGetPurchasesQuery,
  useGetActivePurchasesQuery,
  useCreatePurchaseMutation,
  useCompletePurchaseMutation,
} from '@/lib/api/purchaseApi';
import { useCreateCheckoutSessionMutation } from '@/lib/api/paymentApi';
import { InventorySection, PurchaseStatus, PaymentStatus, CreatePurchaseDto, CreatePurchaseItemDto, Purchase } from '@/types';

export function PurchaseManagement() {
  const { data: purchases, isLoading, error } = useGetPurchasesQuery();
  const { data: activePurchases } = useGetActivePurchasesQuery();
  const [createPurchase, { isLoading: isCreating }] = useCreatePurchaseMutation();
  const [completePurchase, { isLoading: isCompleting }] = useCompletePurchaseMutation();
  const [createCheckoutSession, { isLoading: isRedirecting }] = useCreateCheckoutSessionMutation();

  const sectionOptions = Object.values(InventorySection).filter(
    (value): value is InventorySection => typeof value === 'number'
  );

  const [formData, setFormData] = useState<CreatePurchaseDto>({
    purchasedBy: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseItems: [],
  });

  const [newItem, setNewItem] = useState<CreatePurchaseItemDto>({
    itemName: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    section: InventorySection.SectionA,
  });

  const addItemToPurchase = () => {
    if (!newItem.itemName.trim() || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
      alert('Please enter valid item details');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      purchaseItems: [...prev.purchaseItems, { ...newItem }],
    }));

    setNewItem({
      itemName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      section: InventorySection.SectionA,
    });
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      purchaseItems: prev.purchaseItems.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.purchasedBy.trim()) {
      alert('Please enter who purchased the items');
      return;
    }

    if (formData.purchaseItems.length === 0) {
      alert('Please add at least one item');
      return;
    }

    try {
      const purchase = await createPurchase(formData).unwrap();

      // Redirect to Stripe checkout
      const checkoutResponse = await createCheckoutSession(purchase.id).unwrap();
      window.location.href = checkoutResponse.sessionUrl;
    } catch {
      alert('Failed to create purchase. Please try again.');
    }
  };

  const handlePayNow = async (purchaseId: string) => {
    try {
      const checkoutResponse = await createCheckoutSession(purchaseId).unwrap();
      window.location.href = checkoutResponse.sessionUrl;
    } catch {
      alert('Failed to create payment session. Please try again.');
    }
  };

  const handleCompletePurchase = async (id: string) => {
    try {
      await completePurchase(id).unwrap();
    } catch {
      alert('Failed to complete purchase.');
    }
  };

  const getStatusBadge = (status: PurchaseStatus) => {
    const colors = {
      [PurchaseStatus.Pending]: 'bg-yellow-100 text-yellow-800',
      [PurchaseStatus.Active]: 'bg-green-100 text-green-800',
      [PurchaseStatus.Completed]: 'bg-blue-100 text-blue-800',
      [PurchaseStatus.Cancelled]: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const getStatusText = (status: PurchaseStatus) => {
    return PurchaseStatus[status];
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const colors = {
      [PaymentStatus.NotRequired]: 'bg-gray-100 text-gray-800',
      [PaymentStatus.PendingPayment]: 'bg-orange-100 text-orange-800',
      [PaymentStatus.Paid]: 'bg-green-100 text-green-800',
      [PaymentStatus.Failed]: 'bg-red-100 text-red-800',
      [PaymentStatus.Refunded]: 'bg-purple-100 text-purple-800',
    };
    return colors[status];
  };

  const getPaymentStatusText = (status: PaymentStatus) => {
    const texts = {
      [PaymentStatus.NotRequired]: 'Not Required',
      [PaymentStatus.PendingPayment]: 'Pending Payment',
      [PaymentStatus.Paid]: 'Paid',
      [PaymentStatus.Failed]: 'Failed',
      [PaymentStatus.Refunded]: 'Refunded',
    };
    return texts[status];
  };

  const canCompleteOrderNow = (purchase: Purchase) => {
    return purchase.paymentStatus === PaymentStatus.Paid && purchase.status !== PurchaseStatus.Completed;
  };

  const needsPayment = (purchase: Purchase) => {
    return purchase.paymentStatus === PaymentStatus.PendingPayment || purchase.paymentStatus === PaymentStatus.Failed;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading purchases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load purchases</p>
          <p className="text-sm text-gray-500">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Purchase Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="purchasedBy">Purchased By</Label>
                <Input
                  id="purchasedBy"
                  value={formData.purchasedBy}
                  onChange={(e) => setFormData({ ...formData, purchasedBy: e.target.value })}
                  required
                  placeholder="Enter name"
                />
              </div>

              <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input
                    value={newItem.itemName}
                    onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                    placeholder="e.g., Steel Bolts"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min={1}
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit Price ($)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    value={newItem.section}
                    onChange={(e) => setNewItem({ ...newItem, section: Number(e.target.value) as InventorySection })}
                  >
                    {sectionOptions.map((section) => (
                      <option key={section} value={section}>
                        Section {String.fromCharCode(65 + section)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Notes about this item"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="button" onClick={addItemToPurchase} variant="outline" className="w-full">
                    Add Item to Purchase
                  </Button>
                </div>
              </div>

              {formData.purchaseItems.length > 0 && (
                <div className="border rounded p-2">
                  <p className="font-medium mb-2">Selected Items:</p>
                  {formData.purchaseItems.map((item, index) => (
                    <div key={`${item.itemName}-${index}`} className="flex justify-between items-center mb-1">
                      <span className="text-sm">
                        {item.itemName} • {item.quantity} units @ ${item.unitPrice.toFixed(2)} (Section{' '}
                        {String.fromCharCode(65 + item.section)})
                      </span>
                      <Button type="button" size="sm" variant="outline" onClick={() => removeItem(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button type="submit" disabled={formData.purchaseItems.length === 0 || isCreating || isRedirecting}>
                {isCreating || isRedirecting ? 'Processing...' : 'Create Purchase & Pay'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activePurchases && activePurchases.length > 0 ? (
                activePurchases.map((purchase) => (
                  <div key={purchase.id} className="border rounded p-3 space-y-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{purchase.purchasedBy}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(purchase.status)}`}>
                          {getStatusText(purchase.status)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${getPaymentStatusBadge(purchase.paymentStatus)}`}>
                          {getPaymentStatusText(purchase.paymentStatus)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm">Items: {purchase.purchaseItems.length}</p>
                    <p className="font-medium">${purchase.totalCost.toFixed(2)}</p>
                    <div className="flex gap-2 mt-2">
                      {needsPayment(purchase) && (
                        <Button
                          size="sm"
                          onClick={() => handlePayNow(purchase.id)}
                          disabled={isRedirecting}
                        >
                          {isRedirecting ? 'Redirecting...' : 'Pay Now'}
                        </Button>
                      )}
                      {canCompleteOrderNow(purchase) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompletePurchase(purchase.id)}
                          disabled={isCompleting}
                        >
                          {isCompleting ? 'Processing...' : 'Add to Inventory'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No active purchases</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchased By</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases && purchases.length > 0 ? (
                purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.purchasedBy}</TableCell>
                    <TableCell>{new Date(purchase.purchaseDate).toLocaleDateString()}</TableCell>
                    <TableCell>{purchase.purchaseItems.length}</TableCell>
                    <TableCell>${purchase.totalCost.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(purchase.status)}`}>
                        {getStatusText(purchase.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${getPaymentStatusBadge(purchase.paymentStatus)}`}>
                        {getPaymentStatusText(purchase.paymentStatus)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {needsPayment(purchase) && (
                          <Button
                            size="sm"
                            onClick={() => handlePayNow(purchase.id)}
                            disabled={isRedirecting}
                          >
                            Pay Now
                          </Button>
                        )}
                        {canCompleteOrderNow(purchase) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCompletePurchase(purchase.id)}
                            disabled={isCompleting}
                          >
                            Add to Inventory
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No purchases found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
