const ExpForm = ({ handleUserDate, expDate, expired }) => {

    // note about text input for date picker: date update is based in onChange. this messes with typing a date. for now typing is disabled, but still tab friendly to access date picker itself. could not find a solution in time


    return (
        <form action="#" className="expForm">
            <label htmlFor="expDate">
                {!expired ? 'Finish by:' : 'Expired since...'}

            </label>
            <input
                type="date"
                name="expDate"
                id="expDate"
                onChange={handleUserDate}
                value={expDate}
                onBeforeInput={(event) => {
                    event.preventDefault();
                }}
            />
        </form>
    )
}

export default ExpForm;