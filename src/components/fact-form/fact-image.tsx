import { ImageIcon, TrashIcon } from '@radix-ui/react-icons';
import { Text, Flex, Spinner, AspectRatio, IconButton } from '@radix-ui/themes';

import styles from './fact-image.module.scss';
import { ChangeEvent, useRef } from 'react';
import { useDeleteImage, useImageUpload } from '../../services/image.service.ts';

export function FactImage({ factId, imageUrl }: { factId: string; imageUrl?: string | null }) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { uploadImage, isLoading } = useImageUpload();
    const { deleteImage, isLoading: deleteImageLoading} = useDeleteImage();

    async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const image = event.target.files?.[0];
        if (!image) return;

        await uploadImage(factId, image);
    }

    return (
        <>
            {!imageUrl && (
                <Flex
                    align="center"
                    justify="center"
                    className={styles.selectImage}
                    onClick={() => !isLoading && inputRef.current?.click()}
                >
                    {!isLoading && (
                        <Flex direction="column" align="center">
                            <ImageIcon width={30} height={30} color="teal" />
                            <Text color="teal" size="2">
                                Добавить фото
                            </Text>
                        </Flex>
                    )}
                    {isLoading && (
                        <Flex height="50px" align="center">
                            <Spinner size="3"></Spinner>
                        </Flex>
                    )}
                </Flex>
            )}
            {imageUrl && (
                <AspectRatio ratio={16 / 8} className={styles.imageWrapper}>
                    <img src={imageUrl} className={styles.image} alt="Фото к факту" />
                    <IconButton
                        className={styles.deleteImageBtn}
                        variant="solid"
                        color="red"
                        size="1"
                        onClick={() => deleteImage(factId)}
                        loading={deleteImageLoading}
                    ><TrashIcon/></IconButton>
                </AspectRatio>
            )}
            <input type="file" ref={inputRef} accept="image/*" hidden={true} onChange={handleFileChange} />
        </>
    );
}
