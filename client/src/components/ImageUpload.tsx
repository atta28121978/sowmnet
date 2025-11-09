import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploading?: boolean;
}

interface ImageUploadProps {
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
}

export function ImageUpload({ onImagesChange, maxImages = 10, maxFileSize = 10 }: ImageUploadProps) {
  const { t } = useLanguage();
  const [images, setImages] = useState<ImageFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error(t(
        `Invalid file type. Allowed: JPG, PNG, WebP, GIF`,
        `نوع ملف غير صحيح. المسموح به: JPG, PNG, WebP, GIF`
      ));
      return false;
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      toast.error(t(
        `File size exceeds ${maxFileSize}MB limit`,
        `حجم الملف يتجاوز حد ${maxFileSize}MB`
      ));
      return false;
    }

    return true;
  };

  const addImages = useCallback((files: FileList) => {
    const newImages: ImageFile[] = [];

    Array.from(files).forEach((file) => {
      if (!validateFile(file)) return;

      if (images.length + newImages.length >= maxImages) {
        toast.error(t(
          `Maximum ${maxImages} images allowed`,
          `الحد الأقصى ${maxImages} صور مسموح به`
        ));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const id = Math.random().toString(36).substr(2, 9);
        const imageFile: ImageFile = {
          id,
          file,
          preview: e.target?.result as string,
        };
        setImages((prev) => {
          const updated = [...prev, imageFile];
          onImagesChange(updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  }, [images.length, maxImages, t, onImagesChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addImages(e.target.files);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files) {
      addImages(e.dataTransfer.files);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      onImagesChange(updated);
      return updated;
    });
  };

  const moveImage = (id: string, direction: 'up' | 'down') => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id);
      if (
        (direction === 'up' && index === 0) ||
        (direction === 'down' && index === prev.length - 1)
      ) {
        return prev;
      }

      const updated = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      onImagesChange(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-semibold mb-2">
          {t("Drag and drop images here", "اسحب وأفلت الصور هنا")}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t(
            `or click to browse. Max ${maxImages} images, ${maxFileSize}MB each`,
            `أو انقر للاستعراض. الحد الأقصى ${maxImages} صور، ${maxFileSize}MB لكل منها`
          )}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          {t("Select Images", "اختر الصور")}
        </Button>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">
              {t("Uploaded Images", "الصور المرفوعة")} ({images.length}/{maxImages})
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card key={image.id} className="relative group overflow-hidden">
                <div className="aspect-square bg-muted relative">
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {image.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </div>

                {/* Badge showing position */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
                  {index + 1}
                </div>

                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => removeImage(image.id)}
                    disabled={image.uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Order Controls */}
                <div className="flex gap-1 p-2 bg-muted border-t">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => moveImage(image.id, 'up')}
                    disabled={index === 0 || image.uploading}
                    className="flex-1 text-xs"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => moveImage(image.id, 'down')}
                    disabled={index === images.length - 1 || image.uploading}
                    className="flex-1 text-xs"
                  >
                    ↓
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {t("No images selected yet", "لم يتم اختيار صور حتى الآن")}
          </p>
        </div>
      )}
    </div>
  );
}
