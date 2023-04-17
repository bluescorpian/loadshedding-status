import './css/Modal.css';

export default function Modal({ show, handleClose, children }) {
	const handleOverlayClick = (event) => {
		if (event.target === event.currentTarget) {
			handleClose();
		}
	};

	return (
		<div onClick={handleOverlayClick} className={`Modal ${show ? 'show' : ''}`}>
			<div className='Modal-content'>{children}</div>
		</div>
	);
}
