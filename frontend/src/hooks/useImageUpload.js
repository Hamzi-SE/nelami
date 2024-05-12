import { useState, useEffect } from 'react'

function useImageUpload() {
    const [featuredImg, setFeaturedImg] = useState(""); //->fileInputState
    const [imageOne, setImageOne] = useState("");
    const [imageTwo, setImageTwo] = useState("");
    const [imageThree, setImageThree] = useState("");
    const [previewFeaturedSource, setPreviewFeaturedSource] = useState("");
    const [previewSourceOne, setPreviewSourceOne] = useState("");
    const [previewSourceTwo, setPreviewSourceTwo] = useState("");
    const [previewSourceThree, setPreviewSourceThree] = useState("");

    const previewFeaturedFile = async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewFeaturedSource(reader.result);
            setFeaturedImg(reader.result);
        };
    };

    const previewFileOne = async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSourceOne(reader.result);
            setImageOne(reader.result);
        };
    };

    const previewFileTwo = async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSourceTwo(reader.result);
            setImageTwo(reader.result);
        };
    };

    const previewFileThree = async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSourceThree(reader.result);
            setImageThree(reader.result);
        };
    };

    useEffect(() => {
        setFeaturedImg(previewFeaturedSource);
        setImageOne(previewSourceOne);
        setImageTwo(previewSourceTwo);
        setImageThree(previewSourceThree);
    }, [previewFeaturedSource, previewSourceOne, previewSourceTwo, previewSourceThree]);

    return {
        featuredImg, imageOne, imageTwo, imageThree, previewFeaturedSource, previewSourceOne, previewSourceTwo, previewSourceThree,
        previewFeaturedFile, previewFileOne, previewFileTwo, previewFileThree
    }
}

export default useImageUpload;