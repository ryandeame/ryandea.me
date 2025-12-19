declare module 'react-modal-video' {
    import { Component } from 'react';

    export interface ModalVideoProps {
        channel: 'youtube' | 'vimeo' | 'youku' | 'custom';
        isOpen: boolean;
        videoId?: string;
        url?: string;
        allowFullScreen?: boolean;
        animationSpeed?: number;
        classNames?: {
            modalVideo?: string;
            modalVideoClose?: string;
            modalVideoBody?: string;
            modalVideoInner?: string;
            modalVideoIframeWrap?: string;
            modalVideoCloseBtn?: string;
        };
        aria?: {
            openMessage?: string;
            dismissBtnMessage?: string;
        };
        onClose: () => void;
    }

    export default class ModalVideo extends Component<ModalVideoProps> { }
}
