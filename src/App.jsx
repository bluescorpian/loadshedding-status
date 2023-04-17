import { useEffect, useState, useMemo } from 'react';
import Stage from './Stage';
import Area from './Area';
import Modal from './Modal';
import './css/App.css';
import AreaSearch from './AreaSearch';

// TODO: center flexbox with margin
function App() {
	const [currentStage, setCurrentStage] = useState(null);
	const [selectedAreas, setSelectedAreas] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddAreaModal, setShowAddAreaModal] = useState(false);
	const [areasIds, setAreasIds] = useState(['nelsonmandelabay-3-charloarea5']);

	useEffect(() => {
		Promise.all([
			fetch('https://eskomsepush-api-proxy.dannyk.workers.dev/status?test=current').then((res) => res.json()),
			Promise.all(
				areasIds.map((areaId) => fetch(`https://eskomsepush-api-proxy.dannyk.workers.dev/area?id=${areaId}&test=current`).then((res) => res.json()))
			),
		])
			.then(([stageData, areasData]) => {
				console.log(stageData, areasData);
				setCurrentStage(stageData.status.eskom.stage);
				setSelectedAreas(areasData.map((area, index) => ({ ...area, id: areasIds[index] })));
			})
			.catch((err) => {
				console.error(err);
				setError(err.message || 'Something went wrong');
			})
			.finally(() => setIsLoading(false));
	}, [areasIds]);

	const openShowAreaModal = () => {
		setShowAddAreaModal(true);
	};

	const closeShowAreaModal = () => {
		setShowAddAreaModal(false);
	};

	const handleAddArea = (areaId) => {
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
						{selectedAreas.map((info) => (
							<Area key={info.id} areaInformation={info}></Area>
						))}

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
