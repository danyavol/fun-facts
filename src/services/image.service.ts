import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useEditFact } from './facts.service.ts';

export function useImageUpload() {
    const [isLoading, setIsLoading] = useState(false);
    const { editFact } = useEditFact();

    async function uploadImage(factId: string, image: File): Promise<string> {
        setIsLoading(true);
        const storageRef = ref(getStorage(), `fact-image/${factId}`);

        try {
            // Upload the file to Firebase Storage
            await uploadBytes(storageRef, image);

            // Get the download URL
            const imageUrl = await getDownloadURL(storageRef);
            // Set image url in store
            // TODO: Remove image if fact was deleted
            await editFact({ id: factId, imageUrl });

            return imageUrl;
        } finally {
            setIsLoading(false);
        }
    }

    return { uploadImage, isLoading };
}
