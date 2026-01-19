'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGetProfileQuery, useUpdateOrganizationProfileMutation } from '@/lib/api/profileApi';
import { useProfile } from '@/hooks/useProfile';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiBriefcase,
  FiImage,
  FiLinkedin,
  FiTwitter,
  FiFacebook,
  FiClock,
  FiUsers,
  FiSave,
  FiAlertCircle,
} from 'react-icons/fi';

export function OrganizationProfile() {
  const router = useRouter();
  const { isAdmin, isLoading: profileLoading } = useProfile();
  const { data: profile, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateOrganizationProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contactEmail: '',
    phone: '',
    address: '',
    website: '',
    industry: '',
    logoUrl: '',
    linkedInUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    businessHours: '',
    companySize: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect admin users away from this page
  useEffect(() => {
    if (!profileLoading && isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, profileLoading, router]);

  // Populate form with existing profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        description: profile.description || '',
        contactEmail: profile.contactEmail || '',
        phone: profile.phone || '',
        address: profile.address || '',
        website: profile.website || '',
        industry: profile.industry || '',
        logoUrl: profile.logoUrl || '',
        linkedInUrl: profile.linkedInUrl || '',
        twitterUrl: profile.twitterUrl || '',
        facebookUrl: profile.facebookUrl || '',
        businessHours: profile.businessHours || '',
        companySize: profile.companySize || '',
      });
    }
  }, [profile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid URL (starting with http:// or https://)';
    }

    // Validate social URLs if provided
    const urlFields = ['linkedInUrl', 'twitterUrl', 'facebookUrl', 'logoUrl'] as const;
    urlFields.forEach((field) => {
      const value = formData[field];
      if (value && !/^https?:\/\/.+/.test(value)) {
        newErrors[field] = 'Please enter a valid URL';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      await updateProfile(formData).unwrap();
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Loading states
  if (profileLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center animate-fadeIn">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground text-lg mt-6">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Admin redirect guard
  if (isAdmin) {
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-destructive/10 border border-destructive/20 rounded-2xl p-8 max-w-md animate-fadeIn">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-destructive font-semibold mb-2">Failed to load profile</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
          Organization Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your organization&apos;s information and public profile
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg text-green-800 animate-fadeIn">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiUser className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Essential details about your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your organization name"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description / Bio</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us about your organization..."
                className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contact@organization.com"
                  className="pl-10"
                />
              </div>
              {errors.contactEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.contactEmail}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Extended Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiBriefcase className="w-5 h-5" />
              Extended Information
            </CardTitle>
            <CardDescription>Additional details to help others find and contact you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="industry">Industry / Category</Label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., Retail, Manufacturing"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street, City, State, ZIP"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <FiGlobe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.yourwebsite.com"
                  className="pl-10"
                />
              </div>
              {errors.website && <p className="text-sm text-red-600 mt-1">{errors.website}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Branding & Social */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiImage className="w-5 h-5" />
              Branding & Social
            </CardTitle>
            <CardDescription>
              Logo, social media, and additional business information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="logoUrl">Logo URL</Label>
              <div className="relative">
                <FiImage className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="pl-10"
                />
              </div>
              {errors.logoUrl && <p className="text-sm text-red-600 mt-1">{errors.logoUrl}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="linkedInUrl">LinkedIn</Label>
                <div className="relative">
                  <FiLinkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedInUrl"
                    value={formData.linkedInUrl}
                    onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                    placeholder="https://linkedin.com/company/..."
                    className="pl-10"
                  />
                </div>
                {errors.linkedInUrl && (
                  <p className="text-sm text-red-600 mt-1">{errors.linkedInUrl}</p>
                )}
              </div>

              <div>
                <Label htmlFor="twitterUrl">Twitter</Label>
                <div className="relative">
                  <FiTwitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                    placeholder="https://twitter.com/..."
                    className="pl-10"
                  />
                </div>
                {errors.twitterUrl && (
                  <p className="text-sm text-red-600 mt-1">{errors.twitterUrl}</p>
                )}
              </div>

              <div>
                <Label htmlFor="facebookUrl">Facebook</Label>
                <div className="relative">
                  <FiFacebook className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="pl-10"
                  />
                </div>
                {errors.facebookUrl && (
                  <p className="text-sm text-red-600 mt-1">{errors.facebookUrl}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessHours">Business Hours</Label>
                <div className="relative">
                  <FiClock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessHours"
                    value={formData.businessHours}
                    onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                    placeholder="Mon-Fri 9:00 AM - 5:00 PM"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="companySize">Company Size</Label>
                <div className="relative">
                  <FiUsers className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <select
                    id="companySize"
                    value={formData.companySize}
                    onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                    className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isUpdating}
            className="bg-gradient-to-r from-primary to-tertiary hover:shadow-lg hover:scale-105 transition-all gap-2"
          >
            <FiSave className="w-4 h-4" />
            {isUpdating ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
