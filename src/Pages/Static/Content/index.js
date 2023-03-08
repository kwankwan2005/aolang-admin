import { useState, useCallback } from 'react';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module-react';
import classNames from 'classnames/bind';
import styles from './Content.module.scss';
import 'quill/dist/quill.snow.css';
import { request, HOST_URL } from '../../../warehouse';
import './styles.css';
import ConfirmPopup from '../../../Component/ConfirmPopup';

Quill.register('modules/imageResize', ImageResize);

const cx = classNames.bind(styles);

const TOOLBAR_OPTIONS = [
    ['bold', 'code', 'italic', 'strike', 'underline'],
    [{ background: [] }],
    [{ color: [] }],
    [{ size: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['link'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ header: [false, 1, 2, 3, 4, 5, 6] }],
    [{ indent: '+1' }, { indent: '-1' }],
    [{ align: [] }],
    ['formula', 'image', 'video'],
];

function Content() {
    const [quill, setQuill] = useState();
    const [saveStates, setSaveStates] = useState('');

    const toSave = () => {
        if (quill == null) return;
        const queryParams = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        const payload = new FormData();
        payload.append('filename', queryParams.mode);
        payload.append('contents', JSON.stringify(quill.getContents().ops));
        request.post('/static/writeContents.php', payload).then((res) => setSaveStates('đã lưu thành công'));
    };

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;

        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor);

        const q = new Quill(editor, {
            theme: 'snow',
            modules: {
                imageResize: { parchment: Quill.import('parchment'), modules: ['Resize', 'DisplaySize'] },
                toolbar: {
                    container: TOOLBAR_OPTIONS,
                    handlers: {
                        image: imageHandler,
                    },
                },
            },
        });
        q.root.setAttribute('spellcheck', false);
        const queryParams = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        request
            .get('/static/getContents.php', {
                params: {
                    filename: queryParams.mode,
                },
            })
            .then((res) => q.setContents(res));
        setQuill(q);
    }, []);

    function imageHandler() {
        var range = this.quill.getSelection();
        var value = prompt('What is the image URL');
        if (value) {
            this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
        }
    }

    const uploadMedia = (e) => {
        var file = document.getElementById('avatar-btn').files[0];
        const queryParams = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        if (file.size > 1048576) alert('File phải nhỏ hơn 1MB');
        else {
            const payload = new FormData(document.getElementById('avatar-form'));
            payload.append('id', '');
            payload.append('type', queryParams.mode);
            request.post('/file/uploadFile.php', payload).then((res) => {
                if (res.path.indexOf('/') < 0) {
                    alert(res.path);
                } else {
                    document.getElementById('image-link').innerText = HOST_URL + res.path;
                }
            });
        }
    };

    return (
        <div id="captain">
            <div className={cx('btn-wrapper')}>
                <ConfirmPopup
                    document={document}
                    trigger={<button className={cx('btn')}>Lưu</button>}
                    handling={toSave}
                    question={'Bạn có muốn lưu không?'}
                    saveStates={saveStates}
                    setSaveStates={setSaveStates}
                />
                <form id="avatar-form" encType="multipart/form-data" className={cx('avatar-btn-wrapper')}>
                    <label htmlFor="avatar-btn" className={cx('btn')}>
                        Tải ảnh
                    </label>
                    <input
                        type="file"
                        className={cx('real-btn')}
                        id="avatar-btn"
                        name="myFile"
                        onChange={(e) => uploadMedia(e)}
                    />
                </form>
                <p id={'image-link'}></p>
            </div>
            <div className={cx('content')} ref={wrapperRef}></div>
        </div>
    );
}

export default Content;
