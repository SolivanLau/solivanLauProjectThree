const ExpForm = ({ handleUserDate, expDate, expired }) => {

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