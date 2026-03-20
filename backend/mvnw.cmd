@ECHO OFF
SETLOCAL
SET WRAPPER_DIR=%~dp0.mvn\wrapper
SET MAVEN_PROJECT_DIR=%~dp0
SET MAVEN_PROJECT_DIR=%MAVEN_PROJECT_DIR:~0,-1%
IF NOT EXIST "%WRAPPER_DIR%\maven-wrapper.jar" (
  ECHO Wrapper jar not found.
  EXIT /B 1
)

IF "%JAVA_HOME%"=="" (
  java -classpath "%WRAPPER_DIR%\maven-wrapper.jar" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECT_DIR%" org.apache.maven.wrapper.MavenWrapperMain %*
) ELSE (
  "%JAVA_HOME%\bin\java" -classpath "%WRAPPER_DIR%\maven-wrapper.jar" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECT_DIR%" org.apache.maven.wrapper.MavenWrapperMain %*
)
ENDLOCAL
