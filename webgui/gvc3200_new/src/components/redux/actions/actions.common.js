import $ from 'jquery'
import * as actionUtil from './actionUtil'
import * as Store from '../../entry'

/**
 * 设置语音
 */
export const setCurLocale = (cur_locale) => (dispatch) => {
    dispatch({type: 'LOCALE_CHANGE', curLocale: cur_locale})
}

