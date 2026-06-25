import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  maxImages?: number
  onImagesChange?: (images: string[]) => void
  initialImages?: string[]
}

const ImageUploader = ({ maxImages = 4, onImagesChange, initialImages = [] }: ImageUploaderProps) => {
  const [images, setImages] = useState<string[]>(initialImages)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => resolve(reader.result as string)
    })
  }

  const handleFiles = useCallback(
    async (files: FileList) => {
      const remaining = maxImages - images.length
      const toProcess = Array.from(files).slice(0, remaining)

      const newImages = await Promise.all(toProcess.map(processFile))
      const updated = [...images, ...newImages]
      setImages(updated)
      onImagesChange?.(updated)
    },
    [images, maxImages, onImagesChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files)
    }
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
    onImagesChange?.(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <ImageIcon className="h-4 w-4" />
        <span>{images.length} / {maxImages} images</span>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((src, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-neutral-200">
              <img src={src} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-primary-500 text-white px-1.5 py-0.5 rounded">
                  Featured
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      {images.length < maxImages && (
        <label
          className={cn(
            'flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
            isDragging
              ? 'border-primary-400 bg-primary-50'
              : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-8 w-8 text-neutral-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-600">
              Drop images here or <span className="text-primary-500">browse</span>
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">PNG, JPG up to 10MB each</p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}

export default ImageUploader
