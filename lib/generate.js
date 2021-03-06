'use strict';

var fs = require('fs-extra');
// import { removeSync, outputFileSync, readFileSync } from 'fs-extra';
var chalk = require('chalk');
exports.run = function (type, name, other) {
    var hasOther = typeof other === 'string';
    var baseFilr = __dirname + '/../template/src/pages/example/';
    switch (type) {
        case 'page':
            var pageFile = './src/pages/' + name + '/page.js';
            var styleFile = './src/pages/' + name + '/page.less';
            var servicesFile = './src/pages/' + name + '/services/' + name + '.js';
            var modelsFile = './src/pages/' + name + '/models/' + name + '.js';
            var componentsFile = './src/pages/' + name + '/components/Example.js';
            var componentsStyleFile = './src/pages/' + name + '/components/Example.less';
            var modelsStr = '\nimport * as ' + name + 'Service from \'../services/' + name + '\'\nexport default {\n    namespace: \'' + name + '\',\n    state: {\n        text: \'page work\',\n        list: []\n    },\n    subscriptions: {\n        setup({ dispatch, history }) {\n            return history.listen(({ pathname, query }) => {\n                if (pathname === \'/' + name + '\') {\n                    dispatch({\n                        type: \'fetch\'\n                    })\n                }\n            });\n        }\n    },\n    effects: {\n        *fetch({ payload }, { call, put }) {\n            yield put({\n                type: \'save\', payload: {\n                        text: \'page init\'\n                    }\n            });\n        }\n    },\n    reducers: {\n        save(state, action) {\n            return { ...state, ...action.payload };\n        },\n    },\n};        \n';
            var pageStr = '\nimport { connect } from \'dva\';\nimport styles from \'./page.less\';\n\nfunction App({' + name + ',dispatch}) {\n    const { text,list } = ' + name + ';\n    return (\n        <div className={styles.normal}>\n            <h2>\n                {text}\n            </h2>\n        </div>\n    );\n}\n\nexport default connect(({' + name + '})=>({' + name + '}))(App);\n';
            fs.pathExists(pageFile, function (err, exists) {
                if (exists) {
                    console.log('this file has created');
                } else {
                    // fs.copy(`${baseFilr}page.js`, pageFile, err => {
                    //     if (err) return console.error(err)
                    //     console.log(pageFile + '  has created')
                    // })
                    fs.copy(baseFilr + 'page.less', styleFile, function (err) {
                        if (err) return console.error(err);
                        console.log(styleFile + '  has created');
                    });
                    fs.copy(baseFilr + '/services/example.js', servicesFile, function (err) {
                        if (err) return console.error(err);
                        console.log(servicesFile + '  has created');
                    });
                    fs.outputFileSync(modelsFile, modelsStr, 'utf-8');
                    fs.outputFileSync(pageFile, pageStr, 'utf-8');
                    // fs.copy(`${baseFilr}/models/example.js`, modelsFile, err => {
                    //     if (err) return console.error(err)
                    //     console.log(modelsFile + '  has created')
                    // })
                    fs.copy(baseFilr + '/components/Example.js', componentsFile, function (err) {
                        if (err) return console.error(err);
                        console.log(componentsFile + '  has created');
                    });
                    fs.copy(baseFilr + '/components/Example.less', componentsStyleFile, function (err) {
                        if (err) return console.error(err);
                        console.log(componentsStyleFile + '  has created');
                    });
                }
            });
            break;
        case 'component':
            var componentName = name.replace(/( |^)[a-z]/g, function (L) {
                return L.toUpperCase();
            });
            var componentFile = hasOther ? './src/pages/' + other + '/components/' + componentName + '.js' : './src/components/' + componentName + '.js';
            var componentFileLess = hasOther ? './src/pages/' + other + '/components/' + componentName + '.less' : './src/components/' + componentName + '.less';
            var componentStr = '\nimport React from \'react\';\nimport {styles} from \'./' + componentName + '.less\';\nconst ' + componentName + ' = ({}) => {\n  return (\n    <div>\n      ' + componentName + ' work\n    </div>\n  );\n};\nexport default ' + componentName + ';\n';
            fs.pathExists(pageFile, function (err, exists) {
                if (exists) {
                    console.log('this file has created');
                } else {
                    fs.outputFileSync(componentFile, componentStr, 'utf-8');
                    fs.copy(baseFilr + '/components/Example.less', componentFileLess, function (err) {
                        if (err) return console.error(err);
                        console.log(componentName + '  has created');
                    });
                }
            });
            break;
        default:
            console.log(chalk.red('ERROR: uncaught type , you should input like $ oni g page demo'));
            console.log();
            console.log('  Examples:');
            console.log();
            console.log(chalk.gray('    # create a new page (web)'));
            console.log('    $ oni g page name');
            console.log();
            console.log(chalk.gray('    # create a new page (mobile)'));
            console.log('    $ oni g page name mobile');
            console.log();
            console.log(chalk.gray('    # create a new component (globe)'));
            console.log('    $ oni g component  name');
            console.log(chalk.gray('    # create a new component (page)'));
            console.log('    $ oni g component  name pagename');
            console.log();
            console.log();
            break;
    }
};