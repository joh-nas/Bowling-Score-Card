var app = angular.module('BowlingScoreCard', []);
app.controller('FramesController', function ($scope, $http) {

    var allFrames = [];
    for (var i = 0; i < 10; i++) {
        var frame = { frame: i, one: "", two: "", extra: "", score: "" };
        allFrames.push(frame);
    }
    allFrames[0].one = 9;
    allFrames[0].two = '/';
    allFrames[0].score = 19;
    allFrames[1].one = 9;
    allFrames[1].two = '/';
    $scope.allFrames = allFrames;
    $scope.inputs = ['-', 1, 2, 3, 4, 5, 6, 7, 8, 9, '/', 'X'];
    //$scope.validateInputOne = function (e) {
    //    if (/([1-9xX/-])/.test(e.value)) {
    //        return true;
    //    }
    //    e.value = '';
    //    return false;
    //}

    //$scope.validateInputTwo = function (e) {
    //    if (/([1-9\-\/])/.test(e.value)) {
    //        return true;
    //    }
    //    e.value = '';
    //    return false;
    //}

    //$scope.validateInputExtra = function (e) {
    //    if (/([1-9\-xX\/])/.test(e.value)) {
    //        return true;
    //    }
    //    e.value = '';
    //    return false;
    //}

    $scope.buttonClicked = function(shotResult) {
        var frame = $scope.allFrames[$scope.selectedFrame];
        if ($scope.selectedShot === 1) {
            frame.one = shotResult;
        } else if ($scope.selectedShot === 2) {
            frame.two = shotResult;
        } else if ($scope.selectedShot === 3 && $scope.selectedFrame === 9) {
            frame.extra = shotResult;
        } else {
            return;
        }
        this.calculateScore(frame);
    }

    $scope.scoreFocus = function (frame, shot) {
        if (frame === $scope.selectedFrame && shot === $scope.selectedShot) {
            $scope.selectedFrame = -1;
            $scope.selectedShot = -1;
            return;
        }
        $scope.selectedFrame = frame;
        $scope.selectedShot = shot;
    }

    $scope.calculateScore = function (changedFrame) {
        // First call to the api controller ...
        //$http.get('http://localhost:4482/api/score')
        //    .success(function (data) {
        //        $scope.apiData = data;
        //    })
        //    .error();

        if (changedFrame.frame !== 9
            && (changedFrame.one.toString() === 'X' || changedFrame.two.toString() === 'X')) {
            changedFrame.one = "X";
            changedFrame.two = "";
        }
        if (isFinite(changedFrame.one) && isFinite(changedFrame.two) && Number(changedFrame.one) + Number(changedFrame.two) >= 10) {
            changedFrame.two = "/";
        }
        if (changedFrame.frame === 9) {
            if (changedFrame.two === '/') {
                if (changedFrame.extra.toString() === 'X' || changedFrame.extra === '/') {
                    changedFrame.extra = 'X';
                }
            }
            if (changedFrame.one.toString() === 'X') {
                changedFrame.one = 'X';
                if (changedFrame.two.toString() === 'X') {
                    changedFrame.two = 'X';
                    if (changedFrame.extra.toString() === 'X' || changedFrame.extra === '/') {
                        changedFrame.extra = 'X';
                    }
                } else if (isFinite(changedFrame.two) && isFinite(changedFrame.extra) && Number(changedFrame.two) + Number(changedFrame.extra) >= 10) {
                    changedFrame.extra = "/";
                }
            }
        }
        var allFrames = [];
        for (i = 0; i < 12; i++) {
            allFrames[i] = { one: 0, two: 0 };
        }
        for (i = 0; i < 9; i++) {
            if ($scope.allFrames[i].one.toString() === 'X' || $scope.allFrames[i].two.toString() === 'X') {
                allFrames[i].one = 10;
                allFrames[i].two = 0;
            } else if ($scope.allFrames[i].two === '/') {
                if (isFinite($scope.allFrames[i].one)) {
                    allFrames[i].one = Number($scope.allFrames[i].one);
                } else {
                    allFrames[i].one = 0;
                }
                allFrames[i].two = 10 - allFrames[i].one;
            } else {
                if (isFinite($scope.allFrames[i].one)) {
                    allFrames[i].one = Number($scope.allFrames[i].one);
                } else {
                    allFrames[i].one = 0;
                }
                allFrames[i].two = Number($scope.allFrames[i].two);
            }
            if ($scope.allFrames[i].one === '-' || $scope.allFrames[i].one === '') {
                allFrames[i].one = 0;
            }
            if ($scope.allFrames[i].two === '-' || $scope.allFrames[i].two === '') {
                allFrames[i].two = 0;
            }
        }

        if ($scope.allFrames[9].one.toString() === 'X') {
            allFrames[9].one = 10;
            if ($scope.allFrames[9].two.toString() === 'X') {
                allFrames[10].one = 10;
                if ($scope.allFrames[9].extra.toString() === 'X') {
                    allFrames[11].one = 10;
                } else {
                    if ($scope.allFrames[9].extra === '-' || $scope.allFrames[9].extra === '') {
                        allFrames[11].one = 0;
                    } else {
                        allFrames[11].one = Number($scope.allFrames[9].extra);
                    }
                }
            } else {
                if ($scope.allFrames[9].two === '-' || $scope.allFrames[9].two === '') {
                    allFrames[10].one = 0;
                } else {
                    allFrames[10].one = Number($scope.allFrames[9].two);
                }
                if ($scope.allFrames[9].extra === '/') {
                    allFrames[10].two = 10 - allFrames[10].one
                } else if ($scope.allFrames[9].extra === '-' || $scope.allFrames[9].extra === '') {
                    allFrames[10].two = 0;
                } else {
                    allFrames[10].two = Number($scope.allFrames[9].extra);
                }
            }
        } else if ($scope.allFrames[9].two === '/') {
            if ($scope.allFrames[9].one === '-' || $scope.allFrames[9].one === '') {
                allFrames[9].one = 0;
            } else {
                allFrames[9].one = Number($scope.allFrames[9].one);
            }
            allFrames[9].two = 10 - allFrames[9].one;
            if ($scope.allFrames[9].extra === '-' || $scope.allFrames[9].extra === '') {
                allFrames[10].one = 0;
            }
            else if ($scope.allFrames[9].extra.toString().toLocaleLowerCase() === 'x' ) {
                allFrames[10].one = 10;
            } else {
                allFrames[10].one = Number($scope.allFrames[9].extra);
            }
        } else {
            if ($scope.allFrames[9].one === '-' || $scope.allFrames[9].one === '') {
                allFrames[9].one = 0;
            } else {
                allFrames[9].one = Number($scope.allFrames[9].one);
            }
            if ($scope.allFrames[9].two === '-' || $scope.allFrames[9].two === '') {
                allFrames[9].two = 0;
            } else {
                allFrames[9].two = Number($scope.allFrames[9].two);
            }
        }

        var frameScore = [];
        for (var i = 0; i < 10; i++) {
            frameScore[i] = 0;
        }

        // Calc Frame scores
        for (i = 0; i < $scope.allFrames.length; i++) {
            frameScore[i] = allFrames[i].one + allFrames[i].two;
            // Strike
            if (allFrames[i].one === 10) {
                frameScore[i] += allFrames[i + 1].one + allFrames[i + 1].two;
                if (allFrames[i + 1].one === 10) {
                    frameScore[i] += allFrames[i + 2].one;
                }
            }
                // Spare
            else if (allFrames[i].one + allFrames[i].two === 10) {
                frameScore[i] += allFrames[i + 1].one;
            }
        }

        var totalScore = 0;
        for (i = 0; i < $scope.allFrames.length; i++) {
            totalScore += frameScore[i];
            $scope.allFrames[i].score = totalScore;
        }
    }
});
