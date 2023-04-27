const About = () => {

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',]
    const weekday = new Date().getDay()

    const todayWeekday = daysOfWeek[weekday]
    return (
        <section className="tabDisplay">
            <article className="aboutApp">
                <h2>A {`${todayWeekday}`} Night And ... <span className="emphasis">Empty</span>  Fridge</h2>

                <div className="instructions">

                    <p>Keep track of 2 things for your next romantic date💕 and/or your  fancy shindigs 🍾:</p>

                    <ol>
                        <li>
                            What food is currently is in my fridge?🤔
                        </li>
                        <li>
                            What food do I need to buy?💰
                        </li>
                    </ol>

                    <p>Each List has some features to keep you on track!</p>
                </div>

                <div className="listFeaturesContainer">
                    <div className="listFeatures fridgeFeatures">
                        <h3>Fridge List🧊</h3>
                        <ul>
                            <li>Track when your food has <span className="expiredText">expired</span>  - goodbye stank!🤢</li>
                            <li>Just ran out? switch your fridge item to the grocery list📝</li>
                        </ul>

                    </div>

                    <div className=" listFeatures groceryFeatures">
                        <h3>Grocery List</h3>
                        <ul>
                            <li>Got it? Switch items over to your fridge stock📦</li>
                            <li>If you don't need it, delete it 🚫</li>
                        </ul>

                    </div>
                </div>


            </article>
        </section>
    )
}

export default About;