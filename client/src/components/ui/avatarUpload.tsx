import { UserWithHobbies } from '../../types/user.types';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { useState, useRef } from 'react';

const AvatarUpload: React.FC<AvatarUploadProps> = ({ setInputData }) => {
	const [avatarPreview, setAvatarPreview] = useState<string>('');
	// Обрезка изображения
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	// Для отображения исходного изображения
	const [cropImage, setCropImage] = useState<string | null>(null);
	// Для хранения экземпляра Cropper
	const [cropperInstance, setCropperInstance] = useState<Cropper | null>(null);

	function handleFileChange({ target }: React.ChangeEvent<HTMLInputElement>) {
		if (target && target.files) {
			const file = target.files[0]; // Получаем файл
			if (file) {
				const previewUrl = URL.createObjectURL(file);

				// Устанавливаем изображение для обрезки
				setCropImage(previewUrl);

				// Очистка старых ссылок
				return () => {
					URL.revokeObjectURL(previewUrl);
				};
			}
		}
	}

	function handleCrop() {
		if (!cropperInstance) return;

		const croppedCanvas = cropperInstance.getCroppedCanvas({
			width: 200,
			height: 250
		});

		croppedCanvas.toBlob((blob) => {
			if (blob) {
				const croppedFile = new File([blob], 'cropped-avatar.jpg', {
					type: 'image/jpeg',
					lastModified: Date.now()
				});

				const previewUrl = URL.createObjectURL(blob);
				// устанавливаем превью изображения(иначе поле аватара останется пустым несмотря на то, что изображение успешно загружено)
				setAvatarPreview(previewUrl);

				// Обновляем состояние userData
				setInputData((prev: UserWithHobbies) => ({
					...prev,
					avatar: croppedFile // Сохраняем обрезанное изображение
				}));

				// Очищаем Cropper.js
				setCropImage(null);
				cropperInstance.destroy();
				setCropperInstance(null);
			}
		});
	}

	function handleUpload() {
		fileInputRef.current?.click();
	}

	return (
		<div className="avatar-upload-container">
			<input
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				ref={fileInputRef}
				style={{ display: 'none' }} // Скрываем input
			/>
			<div className="upload-area">
				{avatarPreview && (
					<img
						src={avatarPreview}
						alt="Avatar Preview"
						style={{ width: 200, height: 250 }}
					/>
				)}
				<div className="upload-tooltip" onClick={handleUpload}>
					Загрузить изображение
				</div>
			</div>

			{/* Обрезка изображения */}
			{cropImage && (
				<div className="crop-container">
					<span
						className="crop-span-symbol"
						onClick={handleCrop}
						style={{
							left: '5px'
						}}
					>
						☑
					</span>
					<img
						id="cropImage"
						src={cropImage}
						alt="Crop Preview"
						ref={(imageElement) => {
							if (imageElement && !cropperInstance) {
								const instance = new Cropper(imageElement, {
									aspectRatio: 4 / 5, // Пропорция изображения (200x250)
									viewMode: 2, // Сохраняем изображение внутри рамки без обрезки
									dragMode: 'move', // Двигаем изображение, а не рамку
									autoCropArea: 1, // Область, которая будет автоматически обрезана
									responsive: true, // Адаптация к размеру контейнера
									background: true, // Позволяет видеть фон за рамкой
									checkOrientation: false // Отключаем автоматическое вращение изображений
								});
								setCropperInstance(instance);
							}
						}}
						style={{ maxWidth: '100%' }}
					/>
				</div>
			)}
		</div>
	);
};

interface AvatarUploadProps {
	inputData: UserWithHobbies;
	setInputData: Function;
}

export default AvatarUpload;
