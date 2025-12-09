import React from "react";
import '../assets/css/safetyGrid.css';

import Shoe from '../assets/img/shoe.png';
import Glass from '../assets/img/glass.png';
import Glove from '../assets/img/gloves.png';


function SafetyGrid() {
    return(
        <div className="safety-grid-main">
            <div className="safety-left">
                <h3>பயன்படுத்தவும்</h3>
            </div>
            <div className="safety-right">
                <table className="safety-table">
                    <thead>
                        <tr>
                            <th>காலணி</th>
                            <th>கண்ணாடி</th>
                            <th>கையுறை</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><img src={Shoe} alt="Safety Shoe" /></td>
                            <td><img src={Glass} alt="Safety Glasses" /></td>
                            <td><img src={Glove} alt="Safety Gloves" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SafetyGrid;