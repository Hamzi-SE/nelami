import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

interface ImageGalleryProps {
  images: Array<{ url: string }>
  alt?: string
}

const ImageGallery = ({ images, alt = 'Product image' }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-neutral-100 rounded-lg">
        <p className="text-neutral-400 text-sm">No images available</p>
      </div>
    )
  }

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div className="relative group aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100">
          <img
            src={images[activeIndex]?.url}
            alt={`${alt} ${activeIndex + 1}`}
            className="h-full w-full object-cover"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white hover:bg-black/70"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Expand className="h-4 w-4" />
          </Button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 transition-colors ${
                  index === activeIndex
                    ? 'border-primary-500'
                    : 'border-transparent hover:border-neutral-300'
                }`}
              >
                <img src={img.url} alt={`${alt} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none">
          <div className="relative flex items-center justify-center min-h-[60vh]">
            <img
              src={images[activeIndex]?.url}
              alt={`${alt} ${activeIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain"
            />

            {images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-2 h-10 w-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 h-10 w-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ImageGallery
