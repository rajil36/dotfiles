@echo off
set JLINK_VM_OPTIONS="\
--add-exports jdk.compiler/com.sun.tools.javac.api=javacs \
--add-exports jdk.compiler/com.sun.tools.javac.code=javacs \
--add-exports jdk.compiler/com.sun.tools.javac.comp=javacs \
--add-exports jdk.compiler/com.sun.tools.javac.main=javacs \
--add-exports jdk.compiler/com.sun.tools.javac.tree=javacs \
--add-exports jdk.compiler/com.sun.tools.javac.model=javacs \
--add-exports jdk.compiler/com.sun.tools.javac.util=javacs \
--add-opens jdk.compiler/com.sun.tools.javac.api=javacs"
set DIR=%~dp0
"%DIR%\java" %JLINK_VM_OPTIONS% -m javacs/org.javacs.Main %*
