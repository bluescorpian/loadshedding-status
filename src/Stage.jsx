import './css/Stage.css';

function Stage({ stage }) {
	return (
		<div className={`Stage stage-${stage}`}>
			<h2>{stage == 0 ? 'No Loadshedding' : `Stage ${stage}`}</h2>
		</div>
	);
}

export default Stage;
