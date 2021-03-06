import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { sortBy } from 'lodash';
import * as classNames from 'classnames';

import { ICanaryJudgeGroupScore, ICanaryJudgeScore, ICanaryScoreThresholds } from 'kayenta/domain';
import { ICanaryState } from 'kayenta/reducers';
import * as Creators from 'kayenta/actions/creators';
import { judgeResultSelector, serializedGroupWeightsSelector } from 'kayenta/selectors';

import AllMetricResultsHeader from './allMetricResultsHeader';
import GroupScores from './groupScores';

import './reportScores.less';

interface IReportScoresStateProps {
  groups: ICanaryJudgeGroupScore[];
  score: ICanaryJudgeScore;
  scoreThresholds: ICanaryScoreThresholds;
  selectedGroup: string;
}

interface IReportScoresDispatchProps {
  clearSelectedGroup: () => void;
}

/*
* Layout for the report scores.
* */
const ReportScores = ({
  groups,
  selectedGroup,
  clearSelectedGroup,
  score,
  scoreThresholds,
}: IReportScoresStateProps & IReportScoresDispatchProps) => (
  <section className="horizontal report-scores">
    <AllMetricResultsHeader
      onClick={clearSelectedGroup}
      score={score}
      scoreThresholds={scoreThresholds}
      className={classNames('flex-1', 'report-score', { active: !selectedGroup })}
    />
    <GroupScores groups={groups} className="flex-12" />
  </section>
);

const mapStateToProps = (state: ICanaryState): IReportScoresStateProps => ({
  groups: sortBy(
    judgeResultSelector(state).groupScores,
    // Sort by group weight, then by name.
    [(group: ICanaryJudgeGroupScore) => -serializedGroupWeightsSelector(state)[group.name], 'name'],
  ),
  score: judgeResultSelector(state).score,
  scoreThresholds: state.selectedRun.run.canaryExecutionRequest.thresholds,
  selectedGroup: state.selectedRun.selectedGroup,
});

const mapDispatchToProps = (dispatch: Dispatch<ICanaryState>): IReportScoresDispatchProps => ({
  clearSelectedGroup: () => dispatch(Creators.selectReportMetricGroup({ group: null })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportScores);
