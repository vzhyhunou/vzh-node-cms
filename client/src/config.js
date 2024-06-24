import {PageComponent} from '@vzhyhunou/vzh-cms';

export default (({REACT_APP_SRC, REACT_APP_BASE}) => ({
    locales: {
        en: 'English',
        ru: 'Русский'
    },
    tags: {
        users: {
            ADMIN: 'ADMIN',
            MANAGER: 'MANAGER',
            PAGES_EDITOR: 'PAGES_EDITOR'
        }
    },
    components: {
        Page: PageComponent
    },
    provider: import(`./provider/${REACT_APP_SRC}.js`),
    basename: REACT_APP_BASE
}))(process.env);
