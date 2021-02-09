import { useCamera } from '@ionic/react-hooks/camera';
import { CameraResultType, CameraSource } from "@capacitor/core";

export interface Photo {
    filepath: string;
    webviewPath?: string;
  }

export function usePhotoGallery() {

    const { getPhoto } = useCamera();

    const takePhoto = async () => {
      const cameraPhoto = await getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        quality: 100
      });

      return cameraPhoto.dataUrl;

    };

    const takePicture = async () => {
      const cameraPhoto = await getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 100
      });

       return cameraPhoto.dataUrl
    };

    
  
    return {
        takePhoto, takePicture
    };
}