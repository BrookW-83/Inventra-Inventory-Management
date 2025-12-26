'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  useGetInventoryItemsQuery,
  useDeleteInventoryItemMutation,
  useRemoveInventoryQuantityMutation,
} from '@/lib/api/inventoryApi';
import { InventorySection } from '@/types';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiAlertCircle, FiMinusCircle } from 'react-icons/fi';

export function InventoryList() {
  const { data: items, isLoading, error } = useGetInventoryItemsQuery();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteInventoryItemMutation();
  const [removeStock, { isLoading: isRemoving }] = useRemoveInventoryQuantityMutation();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id).unwrap();
      } catch {
        alert('Failed to delete item');
      }
    }
  };

  const handleRemoveStock = async (id: string, currentQuantity: number) => {
    const quantityStr = prompt('How many units would you like to remove?', '1');
    if (!quantityStr) return;
    const quantity = parseInt(quantityStr, 10);
    if (!quantity || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    if (quantity > currentQuantity) {
      alert('Cannot remove more than available stock.');
      return;
    }
    const performedBy = prompt('Who is performing this action?', 'System') || 'System';
    const reason = prompt('Reason for removal?', 'Removed from inventory') || 'Removed from inventory';

    try {
      await removeStock({ id, body: { quantity, performedBy, reason } }).unwrap();
    } catch {
      alert('Failed to remove inventory');
    }
  };

  const getSectionName = (section: InventorySection) => {
    return String.fromCharCode(65 + section);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center animate-fadeIn">
          <div className="relative mx-auto mb-6">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-muted-foreground text-lg">Loading inventory items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-destructive/10 border border-destructive/20 rounded-2xl p-8 max-w-md animate-fadeIn">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-destructive font-semibold mb-2">Failed to load inventory items</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
              Inventory Items
            </h1>
            <p className="text-muted-foreground">
              Manage your inventory stock and track product information
            </p>
          </div>
          <Link href="/inventory/add">
            <Button className="bg-gradient-to-r from-primary to-tertiary hover:shadow-lg hover:scale-105 transition-all gap-2">
              <FiPlus className="w-4 h-4" />
              Add New Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent/50 hover:bg-accent/50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Quantity</TableHead>
              <TableHead className="font-semibold">Unit Price</TableHead>
              <TableHead className="font-semibold">Section</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items && items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.description}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.quantity < 10 ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono">${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Section {getSectionName(item.section)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Link href={`/inventory/edit/${item.id}`}>
                        <Button size="sm" variant="outline" className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all">
                          <FiEdit2 className="w-3 h-3" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all"
                        onClick={() => handleRemoveStock(item.id, item.quantity)}
                        disabled={isRemoving}
                      >
                        <FiMinusCircle className="w-3 h-3" />
                        {isRemoving ? 'Updating...' : 'Remove'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                      >
                        <FiTrash2 className="w-3 h-3" />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                      <FiPackage className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">No inventory items found</p>
                      <p className="text-sm text-muted-foreground">Get started by adding your first item</p>
                    </div>
                    <Link href="/inventory/add">
                      <Button className="mt-2 gap-2">
                        <FiPlus className="w-4 h-4" />
                        Add First Item
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
