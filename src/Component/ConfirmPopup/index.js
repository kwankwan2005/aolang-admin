import Popup from 'reactjs-popup';

function ConfirmPopup({ document, trigger, handling, question, saveStates, setSaveStates }) {
    return (
        <Popup
            modal
            trigger={trigger}
            onOpen={() => {
                document.getElementById('captain').classList.add('popupOpen');
                setSaveStates('');
            }}
            onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
        >
            {(close) => (
                <div className="popup-wrapper">
                    <p>{question}</p>
                    <div>
                        <button className="popup-btn wrong-color" onClick={close}>
                            Không
                        </button>
                        <button className="popup-btn correct-color" onClick={() => handling()}>
                            Có
                        </button>
                    </div>
                    {saveStates !== '' && <p className="save-successfully">{saveStates}</p>}
                </div>
            )}
        </Popup>
    );
}

export default ConfirmPopup;
