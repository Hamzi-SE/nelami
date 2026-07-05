import { useEffect, useState } from 'react'

interface UseImageUploadReturn {
  featuredImg: string
  imageOne: string
  imageTwo: string
  imageThree: string
  previewFeaturedSource: string
  previewSourceOne: string
  previewSourceTwo: string
  previewSourceThree: string
  previewFeaturedFile: (file: File) => Promise<void>
  previewFileOne: (file: File) => Promise<void>
  previewFileTwo: (file: File) => Promise<void>
  previewFileThree: (file: File) => Promise<void>
}

function useImageUpload(): UseImageUploadReturn {
  const [featuredImg, setFeaturedImg] = useState('')
  const [imageOne, setImageOne] = useState('')
  const [imageTwo, setImageTwo] = useState('')
  const [imageThree, setImageThree] = useState('')
  const [previewFeaturedSource, setPreviewFeaturedSource] = useState('')
  const [previewSourceOne, setPreviewSourceOne] = useState('')
  const [previewSourceTwo, setPreviewSourceTwo] = useState('')
  const [previewSourceThree, setPreviewSourceThree] = useState('')

  const previewFeaturedFile = async (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewFeaturedSource(reader.result as string)
      setFeaturedImg(reader.result as string)
    }
  }

  const previewFileOne = async (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSourceOne(reader.result as string)
      setImageOne(reader.result as string)
    }
  }

  const previewFileTwo = async (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSourceTwo(reader.result as string)
      setImageTwo(reader.result as string)
    }
  }

  const previewFileThree = async (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSourceThree(reader.result as string)
      setImageThree(reader.result as string)
    }
  }

  useEffect(() => {
    setFeaturedImg(previewFeaturedSource)
    setImageOne(previewSourceOne)
    setImageTwo(previewSourceTwo)
    setImageThree(previewSourceThree)
  }, [previewFeaturedSource, previewSourceOne, previewSourceTwo, previewSourceThree])

  return {
    featuredImg,
    imageOne,
    imageTwo,
    imageThree,
    previewFeaturedSource,
    previewSourceOne,
    previewSourceTwo,
    previewSourceThree,
    previewFeaturedFile,
    previewFileOne,
    previewFileTwo,
    previewFileThree,
  }
}

export default useImageUpload
