import React from 'react';

export default class FindPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    	// <div className="appleItem">
    	// 	<div className="apple"><img src="../images/apple.png" alt=""/></div>
     //      <div className="info">
     //          <div className="name">红苹果 - 1号</div>
     //          <div className="weight">265克</div>
     //      </div>
     //    <div className="btn-div"><button>吃掉</button></div>
    	// </div>

    	<div className="appleItem">
    		<div className="apple"><img src="../images/apple.png" alt=""/></div>
          <div className="info">
              <div className="name">Event Title</div>
          </div>
        <div className="btn-div">
        	<button>DETAL</button>
        	<button>ADD</button>
        </div>
    	</div>
    );
  }
}