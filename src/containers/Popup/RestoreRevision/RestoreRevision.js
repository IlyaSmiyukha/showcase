import React, {
  Component,
} from 'react';

import {
  connect,
} from 'react-redux';

import {NotificationManager} from 'react-notifications';

import withPopup from '@/hocs/withPopup';
import PropTypes from 'prop-types';

import {
  ButtonFlat,
  ButtonNormal,
} from '@/components/Buttons';

import {
  getRevisionsList,
  getRevisionsOrgUrl,
  getCurrentRfcId,
} from '@/store/selectors/revisions';

import {
  revisionRestore,
  resetRfcData,
  revisionFetchInitialData,
  setCurrentRfcID,
} from '@/store/actions/revisions';

import locale from '@/api/locale';

import {
  HSeparator,
} from '@/components/Separators';
import SelectComponent from '@/components/Select';

import {
  formatRevisionDate,
} from '@/helpers';

import './RestoreRevision.less';

class RestoreRevision extends Component {
  constructor(props) {
    super(props);

    const published = props.revisionsList.find(revision => revision.type === 'published');

    this.state = {
      revisionsList: props.revisionsList.filter(revision => revision.type !== 'draft').map(revision => ({
        label: `${formatRevisionDate(revision.updated * 1000)} ${revision.type}`,
        value: revision,
      })),
      isPublished: !!published,
      restoring: false,
      revision: published ? {
        label: `${formatRevisionDate(published.updated * 1000)} (${published.type})`,
        value: published,
      } : null,
    };
  }

  handleRevisionChange = (value) => {
    this.setState({
      revision: value,
    });
  }


  handleRestoreRevision = () => {
    const {
      revisionRestore,
      resetRfcData,
      revisionFetchInitialData,
      setCurrentRfcID,
      group,
      rfcId,
      onCloseClick,
    } = this.props;

    const {
      revision,
      isPublished,
    } = this.state;

    this.setState({
      restoring: true,
    });

    const currentPublished = this.props.revisionsList.find(revision => revision.type === 'published');

    if (isPublished && currentPublished.updated !== revision.value.updated) {
      revisionRestore({
        revision,
        restoreTo: {
          group,
          rfc_id: rfcId,
          revision_id: revision.value.revision_id,
          type: 'published',
        },
      });
    }

    revisionRestore({
      revision,
      restoreTo: {
        group,
        rfc_id: rfcId,
        revision_id: revision.value.revision_id,
        type: 'draft',
      },
    });

    setTimeout(() => {
      resetRfcData();
      setCurrentRfcID(rfcId);
      revisionFetchInitialData(rfcId);
      NotificationManager.success(`We reverted the ${isPublished ? 'published' : 'draft'} version of the showcase to the ${revision.label} revision`);

      onCloseClick();
    }, 1000);

  }

  render() {
    const {
      onCloseClick,
      orgUrl,
    } = this.props;

    const {
      revisionsList,
      revision,
      restoring,
    } = this.state;

    return (
      <div className="restore-revision-wrapper sc-padding-10">

        <label className="sc-input-label">Select an old published revision</label>
        <div className="sc-select-revision-wrap">
          <SelectComponent
            name="form-field-name"
            isClearable={false}
            options={revisionsList}
            onChange={(value) => {
              this.handleRevisionChange(value);
            }}
            value={revision}
            className={'sc-select'}
            placeholder={'Select published revision…'}
          />

          {
            revision && <a
              target="_blank"
              href={`${window.location.origin}/showcase/${orgUrl}?revision=${revision.value.revision_id}`}
              rel="noreferrer noopener">{locale.getResource('Preview')}</a>
          }
        </div>

        <p className="sc-input-description">By restoring the showcase to an older published revision you are changing the published and draft versions of the showcase to the selected version</p>

        <HSeparator />
        <div className="sc-buttons-container">
          <ButtonFlat
            className="confirmation-cancel"
            onClick={onCloseClick}
          >
            {locale.getResource('Cancel')}
          </ButtonFlat>
          <ButtonNormal
            className="confirmation-yes"
            onClick={this.handleRestoreRevision}
            disabled={!revision || restoring}
          >
            {restoring ? 'Restoring' : 'Restore'}
          </ButtonNormal>
        </div>
      </div>
    );
  }
}

RestoreRevision.propTypes = {
  onCloseClick: PropTypes.func,
  revisionRestore: PropTypes.func,
  resetRfcData: PropTypes.func,
  setCurrentRfcID:  PropTypes.func,
  revisionFetchInitialData: PropTypes.func,
  revisionsList: PropTypes.array,
  rfcId: PropTypes.string,
  group: PropTypes.string,
  orgUrl: PropTypes.string,
};

const mapStateToProps = state => {
  return ({
    revisionsList: getRevisionsList(state),
    orgUrl: getRevisionsOrgUrl(state),
    rfcId: getCurrentRfcId(state),
  });
};

const mapDispatchToProps = {
  revisionRestore,
  resetRfcData,
  revisionFetchInitialData,
  setCurrentRfcID,
};

export default connect(mapStateToProps, mapDispatchToProps)(withPopup(RestoreRevision));
