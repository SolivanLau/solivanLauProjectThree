const ExpForm = ({ handleExp, expDate }) => {
    // console.log(handleExp)
    // console.log(expDate)

    return (
        <form action="" className="expForm">
            <label htmlFor="expDate">Eat Before: </label>
            <input
                type="date"
                name="expDate"
                id="expDate"
                onChange={handleExp}
                value={expDate}
            />
        </form>
    )
}

export default ExpForm;