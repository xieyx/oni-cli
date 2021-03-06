const fs = require('fs-extra')
// import { removeSync, outputFileSync, readFileSync } from 'fs-extra';
const chalk = require('chalk')
exports.run = function(type, name,other) {
    const hasOther = typeof other === 'string';
    const baseFilr =  __dirname+'/../template/src/pages/example/';
    switch (type) {
        case 'page':
            const pageFile = './src/pages/' + name + '/page.js';
            const styleFile = './src/pages/' + name + '/page.less';
            const servicesFile = './src/pages/' + name + '/services/'+name+'.js';
            const modelsFile = './src/pages/' + name + '/models/'+name+'.js';
            const componentsFile = './src/pages/' + name + '/components/Example.js';
            const componentsStyleFile = './src/pages/' + name + '/components/Example.less';
            const modelsStr =`
import * as ${name}Service from '../services/${name}'
export default {
    namespace: '${name}',
    state: {
        text: 'page work',
        list: []
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/${name}') {
                    dispatch({
                        type: 'fetch'
                    })
                }
            });
        }
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            yield put({
                type: 'save', payload: {
                        text: 'page init'
                    }
            });
        }
    },
    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },
};        
`;
            const pageStr =`
import { connect } from 'dva';
import styles from './page.less';

function App({${name},dispatch}) {
    const { text,list } = ${name};
    return (
        <div className={styles.normal}>
            <h2>
                {text}
            </h2>
        </div>
    );
}

export default connect(({${name}})=>({${name}}))(App);
`;
            fs.pathExists(pageFile, (err, exists) => {
                if (exists) {
                    console.log('this file has created')
                } else {
                    // fs.copy(`${baseFilr}page.js`, pageFile, err => {
                    //     if (err) return console.error(err)
                    //     console.log(pageFile + '  has created')
                    // })
                    fs.copy(`${baseFilr}page.less`, styleFile, err => {
                        if (err) return console.error(err)
                        console.log(styleFile + '  has created')
                    })
                    fs.copy(`${baseFilr}/services/example.js`, servicesFile, err => {
                        if (err) return console.error(err)
                        console.log(servicesFile + '  has created')
                    })
                    fs.outputFileSync(modelsFile,modelsStr,'utf-8');
                    fs.outputFileSync(pageFile,pageStr,'utf-8');
                    // fs.copy(`${baseFilr}/models/example.js`, modelsFile, err => {
                    //     if (err) return console.error(err)
                    //     console.log(modelsFile + '  has created')
                    // })
                    fs.copy(`${baseFilr}/components/Example.js`, componentsFile, err => {
                        if (err) return console.error(err)
                        console.log(componentsFile + '  has created')
                    })
                    fs.copy(`${baseFilr}/components/Example.less`, componentsStyleFile, err => {
                        if (err) return console.error(err)
                        console.log(componentsStyleFile + '  has created')
                    })
                }
            })
            break;
        case 'component':
            const componentName = name.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
            const componentFile = hasOther?'./src/pages/' + other + '/components/'+componentName+'.js':'./src/components/'+componentName+'.js';
            const componentFileLess = hasOther?'./src/pages/' + other + '/components/'+componentName+'.less':'./src/components/'+componentName+'.less';
            const componentStr = `
import React from 'react';
import {styles} from './${componentName}.less';
const ${componentName} = ({}) => {
  return (
    <div>
      ${componentName} work
    </div>
  );
};
export default ${componentName};
`;
            fs.pathExists(pageFile, (err, exists) => {
                if (exists) {
                    console.log('this file has created')
                } else {
                    fs.outputFileSync(componentFile,componentStr,'utf-8');
                    fs.copy(`${baseFilr}/components/Example.less`, componentFileLess, err => {
                        if (err) return console.error(err)
                        console.log(componentName + '  has created')
                    })
                }
            })
            break;
        default:
            console.log(chalk.red(`ERROR: uncaught type , you should input like $ oni g page demo` ))
            console.log()
            console.log('  Examples:')
            console.log()
            console.log(chalk.gray('    # create a new page (web)'))
            console.log('    $ oni g page name')
            console.log()
            console.log(chalk.gray('    # create a new page (mobile)'))
            console.log('    $ oni g page name mobile')
            console.log()
            console.log(chalk.gray('    # create a new component (globe)'))
            console.log('    $ oni g component  name')
            console.log(chalk.gray('    # create a new component (page)'))
            console.log('    $ oni g component  name pagename')
            console.log()
            console.log()
            break;
    }
};