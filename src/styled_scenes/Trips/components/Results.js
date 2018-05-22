// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import Parse from 'parse';

// COMPONENTS
import Col from '../../../shared_components/layout/Col';
import Row from '../../../shared_components/layout/Row';
import TripCart from '../../../shared_components/Carts/Trip';
import Button from '../../../shared_components/Button';
import Day from './Day';

// ACTIONS/CONFIG
import { media } from '../../../libs/styled';
import { tripsData } from '../../../data/home';

// STYLES
import { Highlight } from './styles';
import { Header } from './Day';

const Wrap = styled.div`
  padding: 45px 10px 10px;

  // required for Drag & drop to work properly
  min-height: 112px;
  overflow: auto;

  // ${media.minSMall} {
  //   padding-top: 115px;
  // }

  ${media.minMedium} {
    padding: 25px;
  }
`;

const showEmptyDayIfRearrangeAllowed = (day, isAllowedServiceRearrange) => {
  if (isAllowedServiceRearrange) return true;
  return day.services.length > 0;
};

// MODULE
export default function Results({
  trip,
  showDetails,
  scheduledServices,
  unScheduledServices,
  onServiceDragEnd,
  onServiceRemoveClick,
}) {
  const currentUser = Parse.User.current();
  const allowServiceRearrange = (trip && trip.owner && trip.owner.objectId) === (currentUser && currentUser.id);
  const dayProps = { trip, allowServiceRearrange, onServiceRemoveClick };
  const services = showDetails
    ? [
        ...unScheduledServices
          .filter(day => showEmptyDayIfRearrangeAllowed(day, allowServiceRearrange))
          .map(day => <Day key="null" day={day} {...dayProps} />),
        ...scheduledServices
          .filter(day => showEmptyDayIfRearrangeAllowed(day, allowServiceRearrange))
          .map(day => <Day key={day.day} day={day} {...dayProps} />),
      ]
    : null;
  return (
    <Wrap>
      {!showDetails && (
        <Header>
          <h4>
            Most popular trips to <Highlight>New York</Highlight>
          </h4>
          <Button
            type="button"
            round
            size="small"
            theme="mainFilled"
            onClick={ev => {
              alert('Creating your event');
            }}
            text="Create your own trip"
          />
        </Header>
      )}
      {showDetails ? (
        <DragDropContext onDragEnd={onServiceDragEnd}>{services}</DragDropContext>
      ) : (
        <Row>
          {tripsData.map(item => (
            <Col key={item.title} xsBasis="50%" lgBasis="25%">
              <TripCart item={item} />
            </Col>
          ))}
        </Row>
      )}
    </Wrap>
  );
}

// Props Validation
Results.propTypes = {
  trip: PropTypes.object,
  showDetails: PropTypes.bool,
  scheduledTrips: PropTypes.array,
  unScheduledTrips: PropTypes.array,
  onServiceDragEnd: PropTypes.func.isRequired,
  onServiceRemoveClick: PropTypes.func.isRequired,
};

Results.defaultProps = {
  scheduledTrips: [],
  unScheduledTrips: [],
};
