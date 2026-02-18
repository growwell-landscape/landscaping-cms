/**
 * Admin Dashboard Page
 * Main CMS interface for managing content
 */

"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Save,
  Plus,
  Loader,
  Settings,
  Image,
  Briefcase,
  Globe,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAdminCMS } from "@/hooks/useAdminCMS";
import { ItemEditorComponent } from "@/components/admin/ItemEditorComponent";
import { FieldManagerComponent } from "@/components/admin/FieldManagerComponent";
import { CMS_FILES, CMS_FILE_METADATA, getFileMetadata } from "@/lib/cms-utils";
import type { DataItem } from "@/types/cms";

/**
 * Icon map for file types
 */
const ICON_MAP: Record<string, typeof Settings> = {
  Settings,
  Image,
  Briefcase,
  Globe,
};

/**
 * File selection card component
 */
function FileCard({
  filePath,
  selected,
  onClick,
}: {
  filePath: string;
  selected: boolean;
  onClick: () => void;
}) {
  const metadata = getFileMetadata(filePath);
  if (!metadata) return null;

  const IconComponent = ICON_MAP[metadata.icon as keyof typeof ICON_MAP];

  return (
    <button
      onClick={onClick}
      className={`text-left p-6 rounded-lg border-2 transition-all ${
        selected
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${selected ? "bg-blue-100" : "bg-gray-100"}`}>
          <IconComponent
            className={`h-6 w-6 ${selected ? "text-blue-600" : "text-gray-600"}`}
          />
        </div>
        {selected && <ChevronRight className="h-5 w-5 text-blue-600" />}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{metadata.label}</h3>
      <p className="text-sm text-gray-600">{metadata.description}</p>
      <code className="text-xs mt-3 block text-gray-500 font-mono">{filePath}</code>
    </button>
  );
}

/**
 * Admin Dashboard Page Component
 */
export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectFileInput, setSelectFileInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    items,
    fields,
    selectedFile,
    isLoading,
    loadData,
    saveData,
    updateItemField,
    addItem,
    deleteItem,
    uploadImage,
    addField,
    removeField,
  } = useAdminCMS();

  /**
   * Handle file selection
   */
  const handleSelectFile = (filePath: string) => {
    setSelectFileInput(filePath);
  };

  /**
   * Handle authentication
   */
  const handleAuthenticate = () => {
    if (password) {
      setIsAuthenticated(true);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setSelectFileInput("");
  };

  /**
   * Handle load with password
   */
  const handleLoad = () => {
    if (!selectFileInput) return;
    loadData(selectFileInput, password);
  };

  /**
   * Handle save with password
   */
  const handleSave = () => {
    if (!selectedFile) return;
    saveData(selectedFile, password);
  };

  /**
   * Handle delete item with confirmation
   */
  const handleDeleteItem = (itemId: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem(itemId, password);
    }
  };

  /**
   * Handle image upload
   */
  const handleImageUpload = (itemId: number) => (file: File) => {
    uploadImage(itemId, file, password);
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                CMS Admin Panel
              </h1>
              <p className="text-gray-600">Enter your password to continue</p>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAuthenticate()}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter password"
                  autoFocus
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleAuthenticate}
              disabled={!password}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              CMS Dashboard
            </h1>
            <p className="text-gray-600">
              Manage all your site content with GitHub integration
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Status Bar */}
        {selectedFile && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  {getFileMetadata(selectedFile)?.label || selectedFile} Loaded
                </p>
                <p className="text-xs text-green-700">
                  {items.length} items • {fields.length} fields
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Selection Grid */}
        {!selectedFile && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Select a File to Edit
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(CMS_FILES).map((filePath) => (
                <FileCard
                  key={filePath}
                  filePath={filePath}
                  selected={selectFileInput === filePath}
                  onClick={() => handleSelectFile(filePath)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Load Button (When File Selected) */}
        {selectFileInput && !selectedFile && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ready to Load {getFileMetadata(selectFileInput)?.label}?
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {getFileMetadata(selectFileInput)?.description}
                </p>
              </div>
              <button
                onClick={handleLoad}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                Load Data
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {selectedFile && password && items.length > 0 && (
          <div className="space-y-6">
            {/* Field Manager */}
            <FieldManagerComponent
              fields={fields}
              onAddField={addField}
              onRemoveField={removeField}
              disabled={isLoading}
            />

            {/* Items List */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Items ({items.length})
                </h2>
                <button
                  onClick={addItem}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {items.map((item: DataItem) => (
                  <ItemEditorComponent
                    key={item.id}
                    item={item}
                    fields={fields}
                    password={password}
                    onFieldChange={(fieldName, value) => {
                      updateItemField(item.id as number, fieldName, value);
                    }}
                    onImageUpload={handleImageUpload(item.id as number)}
                    onDelete={() => handleDeleteItem(item.id as number)}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Save Button */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-semibold"
                >
                  {isLoading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {isLoading ? "Saving..." : "Save All Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedFile && password && items.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Image className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6">No items in this file yet</p>
            <button
              onClick={addItem}
              disabled={fields.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Create First Item
            </button>
          </div>
        )}

        {/* Initial State */}
        {!selectFileInput && !selectedFile && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Choose a File
            </h2>
            <p className="text-gray-600">
              Select a JSON file above to start editing your site content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
