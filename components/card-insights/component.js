import React from 'react';
import PropType from 'prop-types';
import Icon from 'components/icon';

import './style.scss';

const Card = () => (
  <div className="c-card-insights">
    <div className="container">
      <div className="row justify-content-between align-items-end">
        <div className="col-3">
          <span className="">CATEGORY</span>
        </div>
        <div className="col-1">
          <Icon name="arrow-right"></Icon>
        </div>
      </div>
      <div className="row justify-content-between">
        <div className="col">
          <h3 className="">
            Carbon Market Incentives to Conserve, Restore and Enhance Soil Carbon
          </h3>
        </div>
        <div className="col">
          <img src="" alt="" className="" />
        </div>
      </div>
      <div className="row">
        <div className="col card-box">
          <h4>LOCATION</h4>
          <h5>La Pampa, Argentina,</h5>
        </div>
        <div className="col card-box">
          <h4>DATE</h4>
          <h5>09.12.2018</h5>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h4>HIGHLIGHTS</h4>
          <ul>
            <li>Native forest soils were rich in silt fraction, organic matter and imogolite.</li>
            <li>Land use affected physical, chemical and magnetic properties of soils.</li>
            <li>
              Soil changes were associated to changes in mineralogy resulting from soil desiccation.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default Card;
