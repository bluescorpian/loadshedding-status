import './css/Area.css';

function formatTime(date) {
    return new Date(date).getHours().toString().padStart(2, "0") + ':' + new Date(date).getMinutes().toString().padStart(2, "0");
}

function Area({ areaInformation }) {

    const event = areaInformation.events[0];

    return (<div className="Area">
        <h2>{areaInformation.info.name}</h2>
        <p>{event ? `Power off ${formatTime(event.start)}-${formatTime(event.end)}` : 'No loadshedding'}</p>
    </div>)
}

export default Area;