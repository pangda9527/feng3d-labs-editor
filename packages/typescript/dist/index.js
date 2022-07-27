/// <reference path="../../../libs/typescriptServices.d.ts" />
var ts;
(function (ts) {
    if (!ts.getClassExtendsHeritageElement) {
        ts.getClassExtendsHeritageElement = function (node) {
            var heritageClause = ts.getHeritageClause(node.heritageClauses, ts.SyntaxKind.ExtendsKeyword);
            return heritageClause && heritageClause.types.length > 0 ? heritageClause.types[0] : undefined;
        };
    }
})(ts || (ts = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  The MIT License (MIT)
//
//  Copyright (c) 2015-present, Dom Chen.
//  All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy of
//  this software and associated documentation files (the "Software"), to deal in the
//  Software without restriction, including without limitation the rights to use, copy,
//  modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
//  and to permit persons to whom the Software is furnished to do so, subject to the
//  following conditions:
//
//      The above copyright notice and this permission notice shall be included in all
//      copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
//  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
//  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//////////////////////////////////////////////////////////////////////////////////////
var ts;
(function (ts) {
    var checker;
    var sourceFiles;
    var rootFileNames;
    var dependencyMap;
    var pathWeightMap;
    var visitedBlocks;
    var calledMethods = [];
    function createMap() {
        var map = Object.create(null);
        // Using 'delete' on an object causes V8 to put the object in dictionary mode.
        // This disables creation of hidden classes, which are expensive when an object is
        // constantly changing shape.
        map["__"] = undefined;
        delete map["__"];
        return map;
    }
    function reorderSourceFiles(program) {
        sourceFiles = program.getSourceFiles();
        rootFileNames = program.getRootFileNames();
        checker = program.getTypeChecker();
        visitedBlocks = [];
        buildDependencyMap();
        var result = sortOnDependency();
        sourceFiles = [];
        rootFileNames = [];
        checker = null;
        dependencyMap = null;
        visitedBlocks = [];
        return result;
    }
    ts.reorderSourceFiles = reorderSourceFiles;
    function addDependency(file, dependent) {
        if (file == dependent) {
            return;
        }
        var list = dependencyMap[file];
        if (!list) {
            list = dependencyMap[file] = [];
        }
        if (list.indexOf(dependent) == -1) {
            list.push(dependent);
        }
    }
    function buildDependencyMap() {
        dependencyMap = createMap();
        for (var i = 0; i < sourceFiles.length; i++) {
            var sourceFile = sourceFiles[i];
            if (sourceFile.isDeclarationFile) {
                continue;
            }
            visitFile(sourceFile);
        }
    }
    function visitFile(sourceFile) {
        var statements = sourceFile.statements;
        var length = statements.length;
        for (var i = 0; i < length; i++) {
            var statement = statements[i];
            if (ts.hasModifier(statement, ts.ModifierFlags.Ambient)) { // has the 'declare' keyword
                continue;
            }
            visitStatement(statements[i]);
        }
    }
    function visitStatement(statement) {
        if (!statement) {
            return;
        }
        switch (statement.kind) {
            case ts.SyntaxKind.ExpressionStatement:
                var expression = statement;
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.ClassDeclaration:
                checkInheriting(statement);
                visitStaticMember(statement);
                if (statement.transformFlags & ts.TransformFlags.ContainsDecorators) {
                    visitClassDecorators(statement);
                }
                break;
            case ts.SyntaxKind.VariableStatement:
                visitVariableList(statement.declarationList);
                break;
            case ts.SyntaxKind.ImportEqualsDeclaration:
                var importDeclaration = statement;
                checkDependencyAtLocation(importDeclaration.moduleReference);
                break;
            case ts.SyntaxKind.ModuleDeclaration:
                visitModule(statement);
                break;
            case ts.SyntaxKind.Block:
                visitBlock(statement);
                break;
            case ts.SyntaxKind.IfStatement:
                var ifStatement = statement;
                visitExpression(ifStatement.expression);
                visitStatement(ifStatement.thenStatement);
                visitStatement(ifStatement.elseStatement);
                break;
            case ts.SyntaxKind.DoStatement:
            case ts.SyntaxKind.WhileStatement:
            case ts.SyntaxKind.WithStatement:
                var doStatement = statement;
                visitExpression(doStatement.expression);
                visitStatement(doStatement.statement);
                break;
            case ts.SyntaxKind.ForStatement:
                var forStatement = statement;
                visitExpression(forStatement.condition);
                visitExpression(forStatement.incrementor);
                if (forStatement.initializer) {
                    if (forStatement.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
                        visitVariableList(forStatement.initializer);
                    }
                    else {
                        visitExpression(forStatement.initializer);
                    }
                }
                break;
            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.ForOfStatement:
                var forInStatement = statement;
                visitExpression(forInStatement.expression);
                if (forInStatement.initializer) {
                    if (forInStatement.initializer.kind === ts.SyntaxKind.VariableDeclarationList) {
                        visitVariableList(forInStatement.initializer);
                    }
                    else {
                        visitExpression(forInStatement.initializer);
                    }
                }
                break;
            case ts.SyntaxKind.ReturnStatement:
                visitExpression(statement.expression);
                break;
            case ts.SyntaxKind.SwitchStatement:
                var switchStatment = statement;
                visitExpression(switchStatment.expression);
                switchStatment.caseBlock.clauses.forEach(function (element) {
                    if (element.kind === ts.SyntaxKind.CaseClause) {
                        visitExpression(element.expression);
                    }
                    element.statements.forEach(function (element) {
                        visitStatement(element);
                    });
                });
                break;
            case ts.SyntaxKind.LabeledStatement:
                visitStatement(statement.statement);
                break;
            case ts.SyntaxKind.ThrowStatement:
                visitExpression(statement.expression);
                break;
            case ts.SyntaxKind.TryStatement:
                var tryStatement = statement;
                visitBlock(tryStatement.tryBlock);
                visitBlock(tryStatement.finallyBlock);
                if (tryStatement.catchClause) {
                    visitBlock(tryStatement.catchClause.block);
                }
                break;
        }
    }
    function visitModule(node) {
        if (node.body.kind === ts.SyntaxKind.ModuleDeclaration) {
            visitModule(node.body);
            return;
        }
        if (node.body.kind === ts.SyntaxKind.ModuleBlock) {
            for (var _i = 0, _a = node.body.statements; _i < _a.length; _i++) {
                var statement = _a[_i];
                if (ts.hasModifier(statement, ts.ModifierFlags.Ambient)) { // has the 'declare' keyword
                    continue;
                }
                visitStatement(statement);
            }
        }
    }
    function checkDependencyAtLocation(node) {
        var symbol = checker.getSymbolAtLocation(node);
        if (!symbol || !symbol.declarations) {
            return;
        }
        var sourceFile = getSourceFileOfNode(symbol.declarations[0]);
        if (!sourceFile || sourceFile.isDeclarationFile) {
            return;
        }
        addDependency(getSourceFileOfNode(node).fileName, sourceFile.fileName);
    }
    function checkInheriting(node) {
        if (!node.heritageClauses) {
            return;
        }
        var heritageClause = null;
        for (var _i = 0, _a = node.heritageClauses; _i < _a.length; _i++) {
            var clause = _a[_i];
            if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                heritageClause = clause;
                break;
            }
        }
        if (!heritageClause) {
            return;
        }
        var superClasses = heritageClause.types;
        if (!superClasses) {
            return;
        }
        superClasses.forEach(function (superClass) {
            checkDependencyAtLocation(superClass.expression);
        });
    }
    function visitStaticMember(node) {
        var members = node.members;
        if (!members) {
            return;
        }
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            if (!ts.hasModifier(member, ts.ModifierFlags.Static)) {
                continue;
            }
            if (member.kind == ts.SyntaxKind.PropertyDeclaration) {
                var property = member;
                visitExpression(property.initializer);
            }
        }
    }
    function visitClassDecorators(node) {
        if (node.decorators) {
            visitDecorators(node.decorators);
        }
        var members = node.members;
        if (!members) {
            return;
        }
        for (var _i = 0, members_2 = members; _i < members_2.length; _i++) {
            var member = members_2[_i];
            var decorators = void 0;
            var functionLikeMember = void 0;
            if (member.kind === ts.SyntaxKind.GetAccessor || member.kind === ts.SyntaxKind.SetAccessor) {
                var accessors = ts.getAllAccessorDeclarations(node.members, member);
                if (member !== accessors.firstAccessor) {
                    continue;
                }
                decorators = accessors.firstAccessor.decorators;
                if (!decorators && accessors.secondAccessor) {
                    decorators = accessors.secondAccessor.decorators;
                }
                functionLikeMember = accessors.setAccessor;
            }
            else {
                decorators = member.decorators;
                if (member.kind === ts.SyntaxKind.MethodDeclaration) {
                    functionLikeMember = member;
                }
            }
            if (decorators) {
                visitDecorators(decorators);
            }
            if (functionLikeMember) {
                for (var _a = 0, _b = functionLikeMember.parameters; _a < _b.length; _a++) {
                    var parameter = _b[_a];
                    if (parameter.decorators) {
                        visitDecorators(parameter.decorators);
                    }
                }
            }
        }
    }
    function visitDecorators(decorators) {
        for (var _i = 0, decorators_1 = decorators; _i < decorators_1.length; _i++) {
            var decorator = decorators_1[_i];
            visitCallExpression(decorator.expression);
        }
    }
    function visitExpression(expression) {
        if (!expression) {
            return;
        }
        switch (expression.kind) {
            case ts.SyntaxKind.NewExpression:
            case ts.SyntaxKind.CallExpression:
                visitCallArguments(expression);
                visitCallExpression(expression.expression);
                break;
            case ts.SyntaxKind.Identifier:
                checkDependencyAtLocation(expression);
                break;
            case ts.SyntaxKind.PropertyAccessExpression:
                checkDependencyAtLocation(expression);
                break;
            case ts.SyntaxKind.ElementAccessExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.ObjectLiteralExpression:
                visitObjectLiteralExpression(expression);
                break;
            case ts.SyntaxKind.ArrayLiteralExpression:
                var arrayLiteral = expression;
                arrayLiteral.elements.forEach(visitExpression);
                break;
            case ts.SyntaxKind.TemplateExpression:
                var template = expression;
                template.templateSpans.forEach(function (span) {
                    visitExpression(span.expression);
                });
                break;
            case ts.SyntaxKind.ParenthesizedExpression:
                var parenthesized = expression;
                visitExpression(parenthesized.expression);
                break;
            case ts.SyntaxKind.BinaryExpression:
                visitBinaryExpression(expression);
                break;
            case ts.SyntaxKind.PostfixUnaryExpression:
            case ts.SyntaxKind.PrefixUnaryExpression:
                visitExpression(expression.operand);
                break;
            case ts.SyntaxKind.DeleteExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.TaggedTemplateExpression:
                visitExpression(expression.tag);
                visitExpression(expression.template);
                break;
            case ts.SyntaxKind.ConditionalExpression:
                visitExpression(expression.condition);
                visitExpression(expression.whenTrue);
                visitExpression(expression.whenFalse);
                break;
            case ts.SyntaxKind.SpreadElement:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.VoidExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.YieldExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.AwaitExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.TypeOfExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.NonNullExpression:
                visitExpression(expression.expression);
                break;
            case ts.SyntaxKind.TypeAssertionExpression:
                visitExpression(expression.expression);
                break;
        }
        // FunctionExpression
        // ArrowFunction
        // ClassExpression
        // OmittedExpression
        // ExpressionWithTypeArguments
        // AsExpression
    }
    function visitBinaryExpression(binary) {
        var left = binary.left;
        var right = binary.right;
        visitExpression(left);
        visitExpression(right);
        if (binary.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
            (left.kind === ts.SyntaxKind.Identifier || left.kind === ts.SyntaxKind.PropertyAccessExpression) &&
            (right.kind === ts.SyntaxKind.Identifier || right.kind === ts.SyntaxKind.PropertyAccessExpression)) {
            var symbol = checker.getSymbolAtLocation(left);
            if (!symbol || !symbol.declarations) {
                return;
            }
            for (var _i = 0, _a = symbol.declarations; _i < _a.length; _i++) {
                var declaration = _a[_i];
                if (declaration.kind === ts.SyntaxKind.VariableDeclaration || declaration.kind === ts.SyntaxKind.PropertyDeclaration) {
                    var variable = declaration;
                    if (variable.initializer) {
                        continue;
                    }
                    if (!variable.delayInitializerList) {
                        variable.delayInitializerList = [];
                    }
                    variable.delayInitializerList.push(right);
                    if (variable.callerList) {
                        for (var _b = 0, _c = variable.callerList; _b < _c.length; _b++) {
                            var callerFileName = _c[_b];
                            checkCallTarget(callerFileName, right);
                        }
                    }
                }
            }
        }
    }
    function visitObjectLiteralExpression(objectLiteral) {
        objectLiteral.properties.forEach(function (element) {
            switch (element.kind) {
                case ts.SyntaxKind.PropertyAssignment:
                    visitExpression(element.initializer);
                    break;
                case ts.SyntaxKind.ShorthandPropertyAssignment:
                    visitExpression(element.objectAssignmentInitializer);
                    break;
                case ts.SyntaxKind.SpreadAssignment:
                    visitExpression(element.expression);
                    break;
            }
        });
    }
    function visitCallArguments(callExpression) {
        if (callExpression.arguments) {
            callExpression.arguments.forEach(function (argument) {
                visitExpression(argument);
            });
        }
    }
    function visitCallExpression(expression) {
        expression = escapeParenthesized(expression);
        visitExpression(expression);
        switch (expression.kind) {
            case ts.SyntaxKind.FunctionExpression:
                var functionExpression = expression;
                visitBlock(functionExpression.body);
                break;
            case ts.SyntaxKind.PropertyAccessExpression:
            case ts.SyntaxKind.Identifier:
                var callerFileName = getSourceFileOfNode(expression).fileName;
                checkCallTarget(callerFileName, expression);
                break;
            case ts.SyntaxKind.CallExpression:
                visitReturnedFunction(expression.expression);
                break;
        }
    }
    function visitReturnedFunction(expression) {
        expression = escapeParenthesized(expression);
        var returnExpressions = [];
        if (expression.kind === ts.SyntaxKind.CallExpression) {
            var expressions = visitReturnedFunction(expression.expression);
            for (var _i = 0, expressions_1 = expressions; _i < expressions_1.length; _i++) {
                var returnExpression = expressions_1[_i];
                var returns = visitReturnedFunction(returnExpression);
                returnExpressions = returnExpressions.concat(returns);
            }
            return returnExpressions;
        }
        var functionBlocks = [];
        switch (expression.kind) {
            case ts.SyntaxKind.FunctionExpression:
                functionBlocks.push(expression.body);
                break;
            case ts.SyntaxKind.PropertyAccessExpression:
            case ts.SyntaxKind.Identifier:
                var callerFileName = getSourceFileOfNode(expression).fileName;
                var declarations = [];
                getForwardDeclarations(expression, declarations, callerFileName);
                for (var _a = 0, declarations_1 = declarations; _a < declarations_1.length; _a++) {
                    var declaration = declarations_1[_a];
                    var sourceFile = getSourceFileOfNode(declaration);
                    if (!sourceFile || sourceFile.isDeclarationFile) {
                        continue;
                    }
                    if (declaration.kind === ts.SyntaxKind.FunctionDeclaration ||
                        declaration.kind === ts.SyntaxKind.MethodDeclaration) {
                        functionBlocks.push(declaration.body);
                    }
                }
                break;
        }
        for (var _b = 0, functionBlocks_1 = functionBlocks; _b < functionBlocks_1.length; _b++) {
            var block = functionBlocks_1[_b];
            for (var _c = 0, _d = block.statements; _c < _d.length; _c++) {
                var statement = _d[_c];
                if (statement.kind === ts.SyntaxKind.ReturnStatement) {
                    var returnExpression = statement.expression;
                    returnExpressions.push(returnExpression);
                    visitCallExpression(returnExpression);
                }
            }
        }
        return returnExpressions;
    }
    function escapeParenthesized(expression) {
        if (expression.kind === ts.SyntaxKind.ParenthesizedExpression) {
            return escapeParenthesized(expression.expression);
        }
        return expression;
    }
    function checkCallTarget(callerFileName, target) {
        var declarations = [];
        getForwardDeclarations(target, declarations, callerFileName);
        for (var _i = 0, declarations_2 = declarations; _i < declarations_2.length; _i++) {
            var declaration = declarations_2[_i];
            var sourceFile = getSourceFileOfNode(declaration);
            if (!sourceFile || sourceFile.isDeclarationFile) {
                continue;
            }
            addDependency(callerFileName, sourceFile.fileName);
            if (declaration.kind === ts.SyntaxKind.FunctionDeclaration) {
                visitBlock(declaration.body);
            }
            else if (declaration.kind === ts.SyntaxKind.MethodDeclaration) {
                visitBlock(declaration.body);
                calledMethods.push(declaration);
            }
            else if (declaration.kind === ts.SyntaxKind.ClassDeclaration) {
                checkClassInstantiation(declaration);
            }
        }
    }
    function getForwardDeclarations(reference, declarations, callerFileName) {
        var symbol = checker.getSymbolAtLocation(reference);
        if (!symbol || !symbol.declarations) {
            return;
        }
        for (var _i = 0, _a = symbol.declarations; _i < _a.length; _i++) {
            var declaration = _a[_i];
            switch (declaration.kind) {
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.MethodDeclaration:
                case ts.SyntaxKind.ClassDeclaration:
                    if (declarations.indexOf(declaration) == -1) {
                        declarations.push(declaration);
                    }
                    break;
                case ts.SyntaxKind.ImportEqualsDeclaration:
                    getForwardDeclarations(declaration.moduleReference, declarations, callerFileName);
                    break;
                case ts.SyntaxKind.VariableDeclaration:
                case ts.SyntaxKind.PropertyDeclaration:
                    var variable = declaration;
                    var initializer = variable.initializer;
                    if (initializer) {
                        if (initializer.kind === ts.SyntaxKind.Identifier || initializer.kind === ts.SyntaxKind.PropertyAccessExpression) {
                            getForwardDeclarations(initializer, declarations, callerFileName);
                        }
                    }
                    else {
                        if (variable.delayInitializerList) {
                            for (var _b = 0, _c = variable.delayInitializerList; _b < _c.length; _b++) {
                                var expression = _c[_b];
                                getForwardDeclarations(expression, declarations, callerFileName);
                            }
                        }
                        if (variable.callerList) {
                            if (variable.callerList.indexOf(callerFileName) == -1) {
                                variable.callerList.push(callerFileName);
                            }
                        }
                        else {
                            variable.callerList = [callerFileName];
                        }
                    }
                    break;
            }
        }
    }
    function checkClassInstantiation(node) {
        var methodNames = [];
        var superClass = ts.getClassExtendsHeritageElement(node);
        if (superClass) {
            var type = checker.getTypeAtLocation(superClass);
            if (type && type.symbol) {
                var declaration = ts.getDeclarationOfKind(type.symbol, ts.SyntaxKind.ClassDeclaration);
                if (declaration) {
                    methodNames = checkClassInstantiation(declaration);
                }
            }
        }
        var members = node.members;
        if (!members) {
            return [];
        }
        var index = calledMethods.length;
        for (var _i = 0, members_3 = members; _i < members_3.length; _i++) {
            var member = members_3[_i];
            if (ts.hasModifier(member, ts.ModifierFlags.Static)) {
                continue;
            }
            if (member.kind === ts.SyntaxKind.MethodDeclaration) { // called by super class.
                var methodName = ts.unescapeLeadingUnderscores(ts.getTextOfPropertyName(member.name));
                if (methodNames.indexOf(methodName) != -1) {
                    visitBlock(member.body);
                }
            }
            if (member.kind === ts.SyntaxKind.PropertyDeclaration) {
                var property = member;
                visitExpression(property.initializer);
            }
            else if (member.kind === ts.SyntaxKind.Constructor) {
                var constructor = member;
                visitBlock(constructor.body);
            }
        }
        for (var i = index; i < calledMethods.length; i++) {
            var method = calledMethods[i];
            for (var _a = 0, members_4 = members; _a < members_4.length; _a++) {
                var memeber = members_4[_a];
                if (memeber === method) {
                    var methodName = ts.unescapeLeadingUnderscores(ts.getTextOfPropertyName(method.name));
                    methodNames.push(methodName);
                }
            }
        }
        if (index == 0) {
            calledMethods.length = 0;
        }
        return methodNames;
    }
    function visitBlock(block) {
        if (!block || visitedBlocks.indexOf(block) != -1) {
            return;
        }
        visitedBlocks.push(block);
        for (var _i = 0, _a = block.statements; _i < _a.length; _i++) {
            var statement = _a[_i];
            visitStatement(statement);
        }
        visitedBlocks.pop();
    }
    function visitVariableList(variables) {
        if (!variables) {
            return;
        }
        variables.declarations.forEach(function (declaration) {
            visitExpression(declaration.initializer);
        });
    }
    function sortOnDependency() {
        var result = {};
        result.sortedFileNames = [];
        result.circularReferences = [];
        pathWeightMap = createMap();
        var dtsFiles = [];
        var tsFiles = [];
        for (var _i = 0, sourceFiles_1 = sourceFiles; _i < sourceFiles_1.length; _i++) {
            var sourceFile = sourceFiles_1[_i];
            var path = sourceFile.fileName;
            if (sourceFile.isDeclarationFile) {
                pathWeightMap[path] = 10000;
                dtsFiles.push(sourceFile);
                continue;
            }
            var references = updatePathWeight(path, 0, [path]);
            if (references.length > 0) {
                result.circularReferences = references;
                break;
            }
            tsFiles.push(sourceFile);
        }
        if (result.circularReferences.length === 0) {
            tsFiles.sort(function (a, b) {
                return pathWeightMap[b.fileName] - pathWeightMap[a.fileName];
            });
            sourceFiles.length = 0;
            rootFileNames.length = 0;
            dtsFiles.concat(tsFiles).forEach(function (sourceFile) {
                sourceFiles.push(sourceFile);
                rootFileNames.push(sourceFile.fileName);
                result.sortedFileNames.push(sourceFile.fileName);
            });
        }
        pathWeightMap = null;
        return result;
    }
    function updatePathWeight(path, weight, references) {
        if (pathWeightMap[path] === undefined) {
            pathWeightMap[path] = weight;
        }
        else {
            if (pathWeightMap[path] < weight) {
                pathWeightMap[path] = weight;
            }
            else {
                return [];
            }
        }
        var list = dependencyMap[path];
        if (!list) {
            return [];
        }
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var parentPath = list_1[_i];
            if (references.indexOf(parentPath) != -1) {
                references.push(parentPath);
                return references;
            }
            var result = updatePathWeight(parentPath, weight + 1, references.concat(parentPath));
            if (result.length > 0) {
                return result;
            }
        }
        return [];
    }
    function getSourceFileOfNode(node) {
        while (node && node.kind !== ts.SyntaxKind.SourceFile) {
            node = node.parent;
        }
        return node;
    }
})(ts || (ts = {}));
