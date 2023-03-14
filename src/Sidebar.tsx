import s from './Sidebar.module.css';
import { useSubscriptions } from './utils/data';
import React, { createContext, useContext } from 'react';
import clsx from 'clsx';
import { IPhaseDef } from './walkthrough/WalkthroughTools';
import { IRenderState } from './render/modelRender';
import { PhaseTimeline } from './PhaseTimeline';
import { Commentary } from './Commentary';

export const WalkthroughSidebar: React.FC = () => {
    let renderState = useRenderState();
    let walkthrough = renderState.walkthrough;
    let camera = renderState.camera;

    function handlePhaseClick(ev: React.MouseEvent, phase: IPhaseDef) {
        if (walkthrough.phase !== phase.id) {
            walkthrough.phase = phase.id;
            walkthrough.time = 0;
            walkthrough.lastBreakTime = null;
            walkthrough.running = false;
            walkthrough.markDirty();
        }
    }

    return <div className={s.walkthrough}>
        <div className={s.split}>

            <div className={s.timelineLeft}>
                <PhaseTimeline />
            </div>

            <div className={s.content}>
                <div className={s.topSplit}>
                    <div className={s.toc}>
                        {walkthrough.phaseList.map((group, i) => {

                            return <div key={group.groupId} className={s.phaseGroup}>
                                <div className={s.phaseGroupTitle}>{group.title}</div>


                                {group.phases.map((phase, j) => {
                                    let active = walkthrough.phase === phase.id;

                                    return <div key={phase.id} className={clsx(s.phase, active && s.active)} onClick={ev => handlePhaseClick(ev, phase)}>
                                        <div className={s.phaseTitle}>{phase.title}</div>
                                    </div>;
                                })}
                            </div>;
                        })}
                    </div>
                    <div className={s.helpers}>
                        <div className={s.camStats}>
                            center = {camera.center.toString(1)}
                        </div>
                        <div className={s.camStats}>
                            angle = {camera.angle.toString(1)}
                        </div>
                    </div>
                </div>
                <Commentary />
            </div>

        </div>
    </div>;
};

export let RenderStateContext = createContext<IRenderState>(null!);

export function useRenderState() {
    let context = useContext(RenderStateContext);
    useSubscriptions(context.htmlSubs);
    return context;
}
