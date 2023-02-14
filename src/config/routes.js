const routes = {
    home: '/admin/dashboard',
    login: '/admin',
    approve: {
        _: '/admin/approve',
        report: {
            _: '/admin/approve/report',
            marahurd: '/admin/approve/report/marahurd',
            vocab: '/admin/approve/report/vocab',
        },
        pending: '/admin/approve/pendingquestion',
    },
    user: {
        _: '/admin/user',
        approve: '/admin/user/approve',
        manage: '/admin/user/management',
    },
    dynamic: {
        _: '/admin/dynamic',
        marahurd: {
            _: '/admin/dynamic/marahurd',
            website: '/admin/dynamic/marahurd/website',
            file: '/admin/dynamic/marahurd/file',
            addtag: '/admin/dynamic/marahurd/addtag',
        },
        vocab: {
            _: '/admin/dynamic/vocab',
            website: '/admin/dynamic/vocab/website',
            file: '/admin/dynamic/vocab/file',
        },
    },
    static: {},
    file: {},
};

export default routes;
