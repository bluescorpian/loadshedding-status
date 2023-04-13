import { useEffect, useState } from "react";
import Stage from "./Stage";
import Area from './Area';
import './css/App.css'

function App() {
	const [currentStage, setCurrentStage] = useState(null);
	const [selectedAreas, setSelectedAreas] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const areasIds = ['nelsonmandelabay-3-charloarea5'];

	useEffect(() => {
		Promise.all([
			fetch('https://eskomsepush-api-proxy.dannyk.workers.dev/status?test=current').then(res => res.json()),
			Promise.all(areasIds.map(areaId => fetch(`https://eskomsepush-api-proxy.dannyk.workers.dev/area?id=${areaId}&test=current`).then(res => res.json())))
		]).then(([stageData, areasData]) => {
			console.log(stageData, areasData);
			setCurrentStage(stageData.status.eskom.stage);
			setSelectedAreas(areasData.map((area, index) => ({ ...area, id: areasIds[index] })));
		}).catch(err => {
			console.error(err);
			setError(err.message || 'Something went wrong');
		}).finally(() => setIsLoading(false));
	}, []);

	function showAddAreaModal() {

	}

	return (
		<div className="App">
			{/* <header>
				<button>Settings</button>
			</header> */}
			<main>
				{isLoading && <p>Loading...</p>}
				{!isLoading && error && <p>Error: {error}</p>}
				{!isLoading && !error && (
					<>
						<Stage stage={currentStage}></Stage>
						{selectedAreas.map(info => <Area key={info.id} areaInformation={info}></Area>)}
						<input type="text" placeholder="Area"></input>
						<button onClick={showAddAreaModal}>Add area</button>
					</>
				)}
			</main>
		</div>
	)
}

export default App;