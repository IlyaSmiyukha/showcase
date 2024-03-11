import React, {
  Component,
} from 'react';

import {
  connect,
} from 'react-redux';
import PropTypes from 'prop-types';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import locale from '@/api/locale';

import AddItem from '@/components/AddItem';
import FilterItem from '@/components/FilterItem';

import {
  getFiltersItems,
} from '@/store/selectors/filters';

import { showFiltersPopup } from '@/store/actions/view';
import {
  sortFilters,
  deleteFilter,
} from '@/store/actions/filters';

import {
  reorder,
} from '@/helpers';

import './Filters.less';

class Filters extends Component {
  constructor(props){
    super(props);
    this.state = {
      filtersList: props.filters ? props.filters : [],
    };
  }

  setFiltersList = (list) => [
    this.setState({
      filtersList: list,
    }),
  ]

  componentDidUpdate() {
    if (this.props.filters !== this.state.filtersList) {
      this.setFiltersList(this.props.filters);
    }
  }

  addNewFilter = () => {
    this.props.showFiltersPopup({
      action: 'add',
    });
  };

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const {
      filtersList,
    } = this.state;
    const newFiltersList = reorder(filtersList, result.source.index, result.destination.index);
    this.props.sortFilters(newFiltersList);
  };

  render() {
    const {
      filtersList,
    } = this.state;

    const {
      deleteFilter,
      showFiltersPopup,
    } = this.props;

    return (
      <div className="sc-filters-wrapper">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {
              (provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="sc-filters-list"
                >
                  {
                    filtersList.map((filter, i) =>(
                      <Draggable key={filter.id} draggableId={filter.id} index={i}>
                        {
                          (provided) => (
                            <div    ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}>
                              <FilterItem
                                filter={filter}
                                showFiltersPopup={showFiltersPopup}
                                deleteFilter={deleteFilter} />
                            </div>
                          )
                        }
                      </Draggable>))
                  }
                  {provided.placeholder}
                </div>
              )
            }
          </Droppable>
        </DragDropContext>

        {
          filtersList.length < 10 &&
            <AddItem
              onClick={this.addNewFilter}
              text={locale.getResource('NewFilter')}
            />
        }

      </div>
    );
  }
};

Filters.propTypes = {
  filters: PropTypes.array,
  showFiltersPopup: PropTypes.func,
  sortFilters: PropTypes.func,
  deleteFilter: PropTypes.func,
};

const mapStateToProps = state => ({
  filters: getFiltersItems(state),
});

const mapDispatchToProps = {
  showFiltersPopup,
  sortFilters,
  deleteFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
