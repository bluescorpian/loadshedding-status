import { useEffect, useState } from 'react';
import Stage from './Stage';
import Area from './Area';
import './css/App.css';
import AreaSearch from './AreaSearch';

// TODO: center flexbox with margin
function App() {
	const [currentStage, setCurrentStage] = useState(null);
	const [selectedAreas, setSelectedAreas] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddAreaModal, setShowAddAreaModal] = useState(false);
	const [areasIds, setAreasIds] = useState(() => {
		const savedAreasIds = localStorage.getItem('areas');
		return savedAreasIds ? JSON.parse(savedAreasIds) : [];
	});

	const handleError = (err) => {
		console.error(err);
		setError(typeof err === 'string' ? err : err.message || 'Something went wrong');
	};

	useEffect(() => {
		localStorage.setItem('areas', JSON.stringify(areasIds));
	}, [areasIds]);

	useEffect(() => {
		Promise.all([
			fetch('https://eskomsepush-api-proxy.bluescorpian.workers.dev/status').then((res) => res.json()),
			Promise.all(
				areasIds.map((areaId) =>
					fetch(`https://eskomsepush-api-proxy.bluescorpian.workers.dev/area?id=${areaId}${import.meta.env.DEV ? '&test=current' : ''}`).then((res) =>
						res.json()
					)
				)
			),
		])
			.then(([stageData, areasData]) => {
				if (stageData.error || areasData.error) throw stageData.error || areasData.error;
				setSelectedAreas(areasData.map((area, index) => ({ ...area, id: areasIds[index] })));
				setCurrentStage(stageData.status.eskom.stage);
			})
			.catch(handleError)
			.finally(() => setIsLoading(false));
	}, [areasIds]);

	const openShowAreaModal = () => {
		setShowAddAreaModal(true);
	};

	const closeShowAreaModal = () => {
		setShowAddAreaModal(false);
	};

	const handleAddArea = (areaId) => {
		if (areasIds.includes(areaId)) return;
		setAreasIds([...areasIds, areaId]);
	};

	return (
		<div className='App'>
			<main>
				{isLoading ? (
					<p>Loading...</p>
				) : error ? (
					<p>Error: {error}</p>
				) : (
					<>
						<Stage stage={currentStage}></Stage>
						{areasIds.length
							? selectedAreas.map((info) => (
									<Area
										key={info.id}
										areaInformation={info}
										deleteArea={() => {
											setAreasIds(areasIds.filter((id) => id !== info.id));
										}}
									></Area>
							  ))
							: 'No areas selected'}

						<button className='add-area' onClick={openShowAreaModal}>
							Add area
						</button>
						<AreaSearch show={showAddAreaModal} handleClose={closeShowAreaModal} handleAddArea={handleAddArea}></AreaSearch>
					</>
				)}
			</main>
		</div>
	);
}

export default App;
