'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type DetectionResult = {
  type: 'receipt' | 'product' | null;
  data: any;
};

export function ImageRecognition() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [detectionResult, setDetectionResult] = useState<DetectionResult>({ type: null, data: null });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);

    setTimeout(() => {
      const isReceipt = Math.random() > 0.5;

      if (isReceipt) {
        setDetectionResult({
          type: 'receipt',
          data: {
            vendor: 'Sample Vendor',
            items: [
              { name: 'Item 1', quantity: 2, price: 19.99 },
              { name: 'Item 2', quantity: 1, price: 29.99 },
            ],
            total: 69.97,
            date: new Date().toISOString().split('T')[0],
          },
        });
      } else {
        setDetectionResult({
          type: 'product',
          data: {
            name: 'Sample Product',
            description: 'Auto-detected product description',
            estimatedPrice: 24.99,
          },
        });
      }

      setIsProcessing(false);
    }, 2000);
  };

  const logToInventory = () => {
    alert('This would log the detected product to inventory');
    resetForm();
  };

  const logToPurchase = () => {
    alert('This would log the detected receipt to purchases');
    resetForm();
  };

  const resetForm = () => {
    setSelectedImage(null);
    setPreview('');
    setDetectionResult({ type: null, data: null });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Image Recognition Entry</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="image">Select Receipt or Product Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
            </div>

            {preview && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-auto max-h-96 mx-auto rounded"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={processImage}
                disabled={!selectedImage || isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Detect & Extract Data'}
              </Button>
              <Button variant="outline" onClick={resetForm} disabled={isProcessing}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detection Result</CardTitle>
          </CardHeader>
          <CardContent>
            {!detectionResult.type && (
              <p className="text-gray-500 text-center py-8">
                Upload and process an image to see detection results
              </p>
            )}

            {detectionResult.type === 'receipt' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="font-medium text-blue-900">Receipt Detected</p>
                </div>

                <div className="space-y-2">
                  <div>
                    <Label>Vendor</Label>
                    <Input value={detectionResult.data.vendor} readOnly />
                  </div>

                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={detectionResult.data.date} readOnly />
                  </div>

                  <div>
                    <Label>Items</Label>
                    <div className="border rounded p-2 space-y-1 bg-gray-50">
                      {detectionResult.data.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Total</Label>
                    <Input value={`$${detectionResult.data.total.toFixed(2)}`} readOnly />
                  </div>
                </div>

                <Button onClick={logToPurchase} className="w-full">
                  Log to Purchase
                </Button>
              </div>
            )}

            {detectionResult.type === 'product' && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="font-medium text-green-900">Product Detected</p>
                </div>

                <div className="space-y-2">
                  <div>
                    <Label>Product Name</Label>
                    <Input value={detectionResult.data.name} />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input value={detectionResult.data.description} />
                  </div>

                  <div>
                    <Label>Estimated Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={detectionResult.data.estimatedPrice}
                    />
                  </div>

                  <div>
                    <Label>Quantity</Label>
                    <Input type="number" defaultValue={1} />
                  </div>

                  <div>
                    <Label>Section</Label>
                    <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                      <option value="0">Section A</option>
                      <option value="1">Section B</option>
                      <option value="2">Section C</option>
                      <option value="3">Section D</option>
                    </select>
                  </div>
                </div>

                <Button onClick={logToInventory} className="w-full">
                  Log to Inventory
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h3 className="font-medium text-base">Receipt Detection</h3>
              <p className="text-gray-600">
                Upload a receipt image and the system will automatically detect and extract:
                vendor name, items purchased, quantities, prices, and total cost. You can then
                review and log it directly to your purchase records.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-base">Product Detection</h3>
              <p className="text-gray-600">
                Upload a product image and the system will identify the item, suggest a name
                and description, and estimate pricing. You can then make any needed corrections
                before logging it to your inventory.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
