export const WS = {
    /* get book by different search criteria */
    'getBookByAuthor':{
        'endpoint':'book/ByAuthor',
        'errorMessage':'Getting Book By Author operation is down. Please try again later'
    },
    'getBookByTitle':{
        'endpoint':'book/ByTitle',
        'errorMessage':'Getting Book By Title operation is down. Please try again later'
    },
    'getBookByGenre':{
        'endpoint':'book/ByGenre',
        'errorMessage':'Getting Book By Genre operation is down. Please try again later'
    },
    'getBookByContent':{
        'endpoint':'book/TextSearch',
        'errorMessage':'Getting Book By Content operation is down. Please try again later'
    },/* get book by different search criteria end */
    /* get books count by genre in home page */
    'getBookGenreCountAdmin':{
        'endpoint':'book/GenreAllCount',
        'errorMessage':'Retrieving Book Count has failed. Please try again later'
    }, /* get books count by genre in home page end */
    /* get Random books */
    'getFeaturedBooks':{
        'endpoint':'book/Randombooks',
        'errorMessage':'Retrieving Featured Books has failed. Please try again later'
    }, /* get Random books end */
    /* register user */
    'registerUser':{
        'endpoint':'user/register',
        'errorMessage':'User Registration is down. Please try again later'
    }, /* register user end */
     /* Login user */
     'loginUser':{
        'endpoint':'authenticator/login',
        'errorMessage':'User Login is down. Please try again later'
    }, /* Login user end */
     /* save book transaction */
     'saveReadBook':{
        'endpoint':'booktrans/save',
        'errorMessage':'Saving Read Book operation is down. Please try again later'
    }, /* save book transaction end */
    /* Getting Books Count By Institution for Librarian Home page*/
    'getInstitutionBooksCount':{
        'endpoint':'book/GenreByInstitution',
        'errorMessage':'Getting Books Count By Institution operation is down. Please try again later'
    }, /* Getting Books Count By Institution for Librarian Home page end */
    /* Modify book */
    'modifyBook':{
        'endpoint':'book/ModifyInfo',
        'errorMessage':'Modifying Book Operation is down. Please try again later'
    },
    /* Modify book end */
    /* Get books List for Admin and Librarian by passing institution id or Kmax */
    'getBooksListAdmin':{
        'endpoint':'book/ByInstitution',
        'errorMessage':'Getting Books List For Admin is down. Please try again later'
    },
    /* Get books List for Admin end */
    /* Remove book */
    'removeBook':{
        'endpoint':'book/Remove',
        'errorMessage':'Removing Book Operation is down. Please try again later'
    },
    /* Remove book end */
    /* Modify User */
    'modifyUser':{
        'endpoint':'user/modify',
        'errorMessage':'Modifying User Details Operation is down. Please try again later'
    },
    /* Modify User end */
    /* Get List of Institutions  */
    'getInstitutionsList':{
        'endpoint':'institution/getAll',
        'errorMessage':'Getting List of Institutions operation is down. Please try again later'
    },
    /* Get List of Institutions end */
    /* Register Institution */
    'registerInstitution':{
        'endpoint':'institution/register',
        'errorMessage':'Registering Institution operation is down. Please try again later'
    },
    /* Register Institution end*/
    /* Get total students count for Admin */
    'getTotalStudentsCount':{
        'endpoint':'user/userCount',
        'errorMessage':'Retrieving Students Count has failed. Please try again later'
    },
    /* Get total students count for Admin end*/
    /* Get total Institutions count for Admin */
    'getTotalInstitutionsCount':{
        'endpoint':'institution/totalCount',
        'errorMessage':'Retrieving Institutions Count has failed. Please try again later'
    },
     /* Get total Institutions count for Admin end */
    /* Get students in an institution count */
    'getInstitutionStudentsCount':{
        'endpoint':'user/userCountByInstitution',
        'errorMessage':'Getting Students Count By Institution operation is down. Please try again later'
    },
    /* Get students in an institution count end */
    /* Deactivate Institution */
    'deactivateInstitution':{
        'endpoint':'institution/updateStatus',
        'errorMessage':'Deactivating Institution operation is down. Please try again later'
    },
    /* Deactivate Institution end */
    /* Upload  Book */
    'uploadBookInitial':{
        'endpoint':'book/save',
        'errorMessage':'Upload Book operation is down. Please try again later'
    },
    /* Upload  Book end */
    /* Upload  Book File */
    'uploadFile':{
        'endpoint':'fileOps/upload',
        'errorMessage':'Upload File Operation is down. Please try again later'
    },
    /* Upload  Book File end */
    /* get weekly data for displaying in admin/librarian home page */
    'getWeeksData':{
        'endpoint':'booktrans/getVolume',
        'errorMessage':'Getting weekly data is down. Please try again later'
    },
    /* get weekly data for displaying in admin/librarian home page en */
    /* Log out */
    'logout':{
        'endpoint':'authenticator/logoff',
        'errorMessage':'Log out is down. Please try again later'
    },
    /* Log out end */
    /* Email Librarian setup */
    'emailSetup':{
        'endpoint':'mail/send',
        'errorMessage':'Email for Librarian Registration is down. Please try again later'
    },
    /* Email Librarian setup end */
    /* Email Institution setup */
    'institutionSetup':{
        'endpoint':'fileOps/setup',
        'errorMessage':'Setting Up Institution Operation is down. Please try again later'
    },
    /* Email Institution setup end */
    /* Get Book */
    'getBookContent':{
        'endpoint':'book/getBook',
        'errorMessage':'Getting Books Operation is down. Please try again later'
    },
    /* Get Book end */
    'getBookGenreInstitutionLibrarian':{
        'endpoint':'book/GenreByInstituion',
        'errorMessage':'Getting Book Genre By Institution operation is down. Please try again later'
    },
    'userDeactivate':{
        'endpoint':'user/deactivateProfile',
        'errorMessage':'Deactivating User Operation is down. Please try again later'
    },
};