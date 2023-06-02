import vt from '@libs/vanilla-toast';

export function toast( title, type, { duration, position } = { duration: 2000, position: 'top-right' } ) {
    if ( typeof vt !== "undefined" && typeof vt[type] === 'function' ) {
        vt[type](title,{
            position,
            duration,
            closable: true,
        });
    }
}